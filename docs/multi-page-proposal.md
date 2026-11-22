# Proposal: move Sunshine Built to a multi-page site (not built yet)

Written 2026-11-22. Nothing here is built. Decisions for Mitch are at the end.

## Push-back first

- **The one-pager is not broken.** It is live, fast and correct. The move only pays off if there is real content to put on the extra pages: finished jobs with photos, and someone (Nat) who will add to them. Without that, a multi-page site is five thin pages that rank worse than one good page. **Cheapest test:** before building anything, collect 3 finished jobs (6 to 10 photos each, suburb, scope, year). If those can't be gathered in two weeks, the CMS will sit empty too.
- **Repo mix-up:** `MayHem777/sunshine-tiny-houses` is the old Squarespace code-block landing page. The Astro + Decap + Cloudflare site is `MayHem777/STH-Website`. This proposal copies STH-Website.
- **Little is indexed today.** The Wayback Machine shows the old Squarespace URLs (`/home`, `/about-us`, `/services`, `/gallery`, `/contact`, plus template sample pages `/float-house`, `/cultural-center`, `/greenspacing`) and they have all returned 404 since the one-pager went live in July. Redirects still matter for old links and bookmarks, but the risk is small.

## The site

Astro (static output) on Cloudflare Pages, Git-connected to this repo, same pattern as STH-Website.

| Page | Path | Content |
|---|---|---|
| Home | `/` | Current one-pager content, trimmed, linking to the pages below |
| Services | `/services/` + one page per service (new homes, renovations, insurance repairs, fit-outs, carpentry and decks, saunas) | Real scope text from Mitch; no stock claims |
| Projects (case studies) | `/projects/` and `/projects/<slug>/` | Decap collection: title, suburb, year, type, scope, photos, optional client quote **only with written permission** |
| News / posts | `/news/` and `/news/<slug>/` | Decap collection, optional; skip at launch if nobody will write |
| About | `/about/` | Who, how long, licence and insurance, Noosaville base |
| Contact | `/contact/` + `/contact/thank-you/` | Form, phone, email |
| Privacy | `/privacy/` | Needed once a form collects personal details |

Every page: licensee line (M.J. Croft Pty Ltd ATF The Croft Trust, QBCC licence 15205110) in the header and footer through one shared layout component, so it can't be left off a page.

**Decap CMS for Nat** at `/admin/`, GitHub backend, edits are commits. Nat needs a GitHub account added to the repo, plus an OAuth proxy: reuse the STH-Website OAuth Worker if it accepts a second site's origin, otherwise a copy. Use Decap's editorial workflow so Nat's edits arrive as branches with a preview link and Mitch publishes. Photos resized at build (Astro image) so phone photos don't slow the site.

**Contact form → info@sunshinebuilt.com.au.** A Pages Function with Cloudflare Turnstile (free) and a honeypot, sending one plain email per enquiry. Sending options, cheapest first:
1. Cloudflare Email Sending from the Worker, if the domain moves to Cloudflare DNS (Workers Paid is already paid; confirm the sending price before choosing).
2. Microsoft Graph `sendMail` from a send-only Entra app limited to info@sunshinebuilt.com.au (M365 is already paid; same pattern as the box-jobs hub sender).
3. Resend like Tiny Trailers. Likely needs a paid Resend plan for a second domain (check), so last choice.

No HubSpot unless Mitch wants Sunshine Built leads there (the STH AutoDraft job watches STH's info@ only, so no clash either way).

**SEO:** `@astrojs/sitemap` (excluding admin, thank-you and 404), `robots.txt`, canonical tags, and schema.org JSON-LD: `GeneralContractor` (a LocalBusiness type) with `name`, `legalName`, ABN as `taxID`, QBCC as `hasCredential`, phone, email, Noosaville address (suburb only unless Mitch wants the street shown), `areaServed`, `sameAs` for real profiles only. Each project page gets its own JSON-LD only for facts that are true; no `aggregateRating` unless real reviews are shown on the page.

**Redirects** (`public/_redirects`, all 301):

```
/home              /
/about-us          /about/
/services          /services/
/gallery           /projects/
/contact           /contact/
/cart              /
/float-house       /projects/
/cultural-center   /projects/
/greenspacing      /projects/
/index.html        /
/about.html        /about/
/services.html     /services/
/gallery.html      /projects/
/contact.html      /contact/
/thank-you.html    /contact/thank-you/
```

Before cutover, export Search Console's indexed pages for sunshinebuilt.com.au (Mitch, if the property exists) and add anything missing. A test script curls every old path on the preview and fails on anything that isn't a 301 to a 200.

## Hosting and DNS cutover

Recommended: **move the domain's nameservers from VentraIP to Cloudflare (free plan).** Reasons: Cloudflare Pages needs the zone on Cloudflare to serve the apex (`sunshinebuilt.com.au`) properly, and it unlocks Cloudflare Email Sending. The domain registration itself stays at VentraIP.

1. Build and approve the site on `sunshine-built.pages.dev` previews (behind nothing; previews are noindex).
2. Two days before: lower the TTLs at VIPControl to 300 s. Screenshot or export every current DNS record (rollback copy).
3. Add the zone to Cloudflare. Check the imported records against the export, especially **MX `sunshinebuilt-com-au.mail.protection.outlook.com`, SPF, `MS=` TXT, autodiscover and any DKIM CNAMEs** for M365. Mail records stay "DNS only" (grey cloud).
4. In the Pages project, add custom domains `www.sunshinebuilt.com.au` and `sunshinebuilt.com.au`, apex redirecting to www (keeps the current canonical URLs).
5. At VIPControl, change the nameservers to the two Cloudflare ones. (Hard stop: Mitch's OK on the day.)
6. Once Cloudflare shows the zone active: check `https://www.` and the apex load the new site with a valid certificate, every redirect, the form end to end (a real test enquiry lands in info@), and that mail still flows in both directions (send a test email in and out).
7. Remove the `CNAME` file / switch off GitHub Pages for this repo only after the new site is serving.
8. Search Console: submit the new sitemap.

**Rollback:** change the nameservers back at VIPControl (the old records are untouched there), and GitHub Pages is still configured until step 7.

Smaller alternative if Mitch doesn't want to move nameservers: keep DNS at VentraIP, point `www` CNAME at `sunshine-built.pages.dev`, and leave the apex on GitHub Pages purely as a redirect to www. Works, but two hosts to keep in mind and no Cloudflare Email Sending.

## Should the repo go private?

**Yes, but only at cutover, not now.** GitHub Pages on a free account needs the repo public, so making it private today takes the live site down. Cloudflare Pages builds from private repos, and Decap works with a private repo. Nothing secret is in it, but there's no reason for the business's site source and future client job details to be public. Make it private in step 7 above.

## Rough effort

About 1 to 2 sessions to build the site, redirects, schema, form and CMS once real content exists; half a session for the cutover with Mitch on hand.

## Decisions for Mitch (recommended answer first)

1. Go ahead only once 3 real finished jobs with photos are gathered? **Yes**: the test that the site will have content.
2. Move nameservers to Cloudflare at cutover? **Yes**: apex support, email sending, matches the other sites.
3. Form email route? **Cloudflare Email Sending if the price is nil or cents; otherwise Graph from info@.**
4. Nat edits through Decap with Mitch publishing (editorial workflow)? **Yes**: Nat can't break the live site.
5. Show the Noosaville street address on the site and in schema? **Suburb only** unless the workshop takes walk-ins.
6. Make the repo private at cutover? **Yes.**
