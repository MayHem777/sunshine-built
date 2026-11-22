/**
 * Contact form handler (Cloudflare Pages Function): POST /api/contact
 *
 * Sending is OFF unless CONTACT_SEND_ENABLED is exactly "true". While off, a valid
 * submission is logged (Workers logs) and the visitor still sees the thank-you page.
 *
 * Settings (Pages project > Settings > Variables and secrets):
 *   CONTACT_SEND_ENABLED   "true" to email enquiries (plain variable)
 *   TURNSTILE_SECRET       Cloudflare Turnstile secret key (secret)
 *   GRAPH_TENANT_ID        Microsoft 365 tenant ID (plain variable)
 *   GRAPH_CLIENT_ID        Entra app (client) ID of the send-only app (plain variable)
 *   GRAPH_CLIENT_SECRET    that app's client secret (secret)
 *   CONTACT_MAILBOX        optional, defaults to info@sunshinebuilt.com.au
 *
 * The Entra app needs the Mail.Send application permission, limited by an Exchange
 * application access policy (or RBAC for Applications) to the one mailbox. It sends
 * FROM that mailbox TO that mailbox, with Reply-To set to the visitor.
 */

const DEFAULT_MAILBOX = 'info@sunshinebuilt.com.au';
// Cloudflare's documented always-pass test secret, used only while sending is off.
const TEST_TURNSTILE_SECRET = '1x0000000000000000000000000000000AA';
const LIMITS = { name: 100, phone: 30, email: 200, suburb: 80, jobType: 60, message: 4000 };

const redirect = (request, path) => Response.redirect(new URL(path, request.url).href, 303);

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return redirect(request, '/contact/?error=missing');
  }
  const get = (k) => String(form.get(k) ?? '').trim().slice(0, LIMITS[k] ?? 200);

  // Honeypot: bots fill every field. Pretend it worked and drop it.
  if (String(form.get('website') ?? '').trim() !== '') {
    console.log(JSON.stringify({ event: 'contact_honeypot' }));
    return redirect(request, '/contact/thank-you/');
  }

  const data = {
    name: get('name'),
    phone: get('phone'),
    email: get('email'),
    suburb: get('suburb'),
    jobType: get('jobType'),
    message: get('message'),
  };
  if (!data.name || !data.phone || !data.suburb || !data.jobType || !data.message) {
    return redirect(request, '/contact/?error=missing');
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) data.email = '';

  const sending = env.CONTACT_SEND_ENABLED === 'true';
  const secret = env.TURNSTILE_SECRET || (sending ? '' : TEST_TURNSTILE_SECRET);
  if (!secret) {
    console.error(JSON.stringify({ event: 'contact_config', error: 'TURNSTILE_SECRET missing' }));
    return redirect(request, '/contact/?error=send');
  }
  const ok = await verifyTurnstile(secret, String(form.get('cf-turnstile-response') ?? ''), request.headers.get('CF-Connecting-IP'));
  if (!ok) return redirect(request, '/contact/?error=check');

  if (!sending) {
    // Preview mode: log instead of emailing.
    console.log(JSON.stringify({ event: 'contact_logged_not_sent', ...data }));
    return redirect(request, '/contact/thank-you/');
  }

  try {
    await sendMail(env, data);
    console.log(JSON.stringify({ event: 'contact_sent', jobType: data.jobType }));
    return redirect(request, '/contact/thank-you/');
  } catch (err) {
    console.error(JSON.stringify({ event: 'contact_send_failed', error: String(err && err.message || err) }));
    return redirect(request, '/contact/?error=send');
  }
}

export async function onRequest({ request }) {
  // Anything other than POST (onRequestPost wins for POST).
  return redirect(request, '/contact/');
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out = await res.json();
    return out.success === true;
  } catch {
    return false;
  }
}

async function sendMail(env, d) {
  const mailbox = env.CONTACT_MAILBOX || DEFAULT_MAILBOX;
  for (const k of ['GRAPH_TENANT_ID', 'GRAPH_CLIENT_ID', 'GRAPH_CLIENT_SECRET']) {
    if (!env[k]) throw new Error(`${k} missing`);
  }
  const tokenRes = await fetch(`https://login.microsoftonline.com/${env.GRAPH_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GRAPH_CLIENT_ID,
      client_secret: env.GRAPH_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });
  if (!tokenRes.ok) throw new Error(`token ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const rows = [
    ['Name', d.name], ['Phone', d.phone], ['Email', d.email || '(not given)'],
    ['Suburb', d.suburb], ['Type of job', d.jobType],
  ].map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('');
  const html = `<p>New enquiry from the Sunshine Built website.</p><table>${rows}</table>`
    + `<p><b>About the job</b></p><p>${esc(d.message).replace(/\n/g, '<br>')}</p>`;

  const message = {
    subject: `Website enquiry: ${d.jobType} – ${d.name} (${d.suburb})`,
    body: { contentType: 'HTML', content: html },
    toRecipients: [{ emailAddress: { address: mailbox } }],
  };
  if (d.email) message.replyTo = [{ emailAddress: { address: d.email, name: d.name } }];

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, saveToSentItems: false }),
  });
  if (res.status !== 202) throw new Error(`sendMail ${res.status}`);
}
