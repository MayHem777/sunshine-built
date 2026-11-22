# Contact form: what's needed to switch on sending

The form and the sending code are built (`functions/api/contact.js`). Sending is **off**: on the preview, a valid enquiry is written to the Cloudflare logs and the visitor sees the thank-you page. Nothing below has been created yet. Each item is a credential or a live change, so each needs Mitch's OK.

## 1. Microsoft 365: a send-only app for info@sunshinebuilt.com.au

info@sunshinebuilt.com.au is in the existing Sunshine (STH) Microsoft 365 tenant.

1. Entra admin centre > App registrations > New registration. Name: `Sunshine Built website form`. Single tenant, no redirect URI.
2. Limit it to the one mailbox with **Exchange RBAC for Applications**, the same way as the box-jobs "Claude Box Bills Sender" app and the m365-mail-mcp app. Don't grant tenant-wide Mail.Send in Entra.
   - Exchange Online PowerShell: `New-ServicePrincipal` for the app, a management scope covering only info@sunshinebuilt.com.au, then `New-ManagementRoleAssignment` with the role `Application Mail.Send` and that scope.
   - Check with `Test-ServicePrincipalAuthorization`: allowed for info@sunshinebuilt.com.au, denied for any other mailbox (e.g. nat@).
3. Certificates & secrets > New client secret, 24 months. Note the expiry date.
4. Record it in `~/repos/claude-monitor/inventory/credentials.json`: name, where it lives (Pages project secret), scope (Mail.Send, info@sunshinebuilt only), expiry, how to rotate. Never the value.

## 2. Cloudflare Turnstile (free)

Cloudflare dashboard > Turnstile > Add widget. Name `sunshine-built-contact`, mode Managed, hostnames `www.sunshinebuilt.com.au` and `sunshinebuilt.com.au` (add the pages.dev preview hostname too, to test before cutover). You get a site key (public) and a secret key.

## 3. Settings on the Cloudflare Pages project

| Name | Type | Value |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | build variable (read at build time) | Turnstile site key |
| `TURNSTILE_SECRET` | secret | Turnstile secret key |
| `GRAPH_TENANT_ID` | variable | the STH tenant ID |
| `GRAPH_CLIENT_ID` | variable | the new app's client ID |
| `GRAPH_CLIENT_SECRET` | secret | the new app's client secret |
| `CONTACT_SEND_ENABLED` | variable | `true` (leave unset until everything above is in) |

Add the secret names (not values) to `monitor.json` `secrets`.

## 4. Test

Rebuild and deploy, send one real enquiry, and check:
- it arrives in info@sunshinebuilt.com.au, and Reply goes to the visitor's email
- a blank field and a missed Turnstile tick each show the error message
- the honeypot drops a bot submission without an email
- if Graph fails, the visitor is told to call or email (tested locally 2026-11-22: sending on with no Microsoft settings shows the error and sends nothing)
