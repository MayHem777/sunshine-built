# Sunshine Built website

Website for **www.sunshinebuilt.com.au**. Read this file and `PLAN.md` before changing anything.

## The business

- **Sunshine Built** is a trading name of **M.J. Croft Pty Ltd ATF The Croft Trust**.
- The QBCC Notice of Cover names the contractor **M.J. CROFT PTY LTD**, licence 15205110, Builder – Low Rise. The site uses "M.J. Croft Pty Ltd ATF The Croft Trust", which contains that name exactly (Mitch, 2026-11-22).
- ABN **40 270 427 080** · QBCC licence **15205110** · based in **Noosaville QLD**.
- Phone 0401 744 844 · info@sunshinebuilt.com.au (Microsoft 365 mailbox).
- Licensed builder: new homes, renovations and extensions, insurance repairs, shop fit-outs, carpentry and decks, custom saunas, across Noosa and the Sunshine Coast.
- Sister company: Sunshine Tiny Houses (modular homes, granny flats, tiny homes; sunshinetinyhouses.com.au). Modular work is referred there; conventional on-site building stays with Sunshine Built.

## Rules (do not break)

1. **Licensee name and QBCC number sitewide.** Every page (including the 404 page and any thank-you page) shows the licensee name *M.J. Croft Pty Ltd ATF The Croft Trust* together with *QBCC licence 15205110*, legible (body-size text, good contrast, not a tiny grey mono label alone) and reasonably prominent: in the header or hero area and in the footer. Check it on a phone width before calling any change done.
2. **Real content only.** No invented projects, photos, reviews, testimonials, star ratings, awards, statistics or client names. If content is missing, leave a clear placeholder in the branch and list it under "Waiting on Mitch" in `PLAN.md`; never fill it with something made up. Stock or template sample pages (the old Squarespace site had template pages such as `/float-house`, `/cultural-center`, `/greenspacing`) are not our projects.
   - Experience wording: say **"On the tools since 2004"**. Do not say the experience was on the Sunshine Coast (the apprenticeship location isn't confirmed). Never claim the business itself is 20 years old (no "twenty years", "two decades", "20+ years", "established").
   - Insurance wording: say **"QBCC licensed and insured"**. Never "fully insured" or "fully insured on every project" (full cover on Sunshine Built jobs isn't confirmed).
   - Both can be strengthened **only after Mitch confirms** (2026-11-22: not yet confirmed).
3. **Australian English and metric units only** (mm, m, m²). Never show imperial.
4. **Never assume anyone's gender**; use names, roles or "they".
5. **Workflow:** work on a feature branch, never on `master`/`main`. Publish a preview URL and show it to Mitch. Merge and deploy to production **only after Mitch approves in that session.** Never force-push.

## How it is built and hosted

### Live today: `master` (one-pager on GitHub Pages)

- `master` holds the single-page site (`index.html`, `404.html`, `images/`, `CNAME`, `_config.yml`). It is served by **GitHub Pages**, legacy build from `master` root, custom domain `www.sunshinebuilt.com.au`, HTTPS enforced.
- **Pushing to `master` deploys to the live site within a minute.** Hard stop: Mitch's OK first.
- The repo is **public** (GitHub Pages on a free plan needs it). It goes private at the DNS cutover (Mitch, 2026-11-22).
- DNS: nameservers `ns1-3.nameserver.net.au` (VentraIP, VIPControl). Apex: four GitHub Pages A records, 301 to `www`; `www` CNAME `mayhem777.github.io`. Mail: MX `sunshinebuilt-com-au.mail.protection.outlook.com`, SPF `include:spf.protection.outlook.com -all`, TXT `MS=ms28511729`. Never touch the mail records.
- `_config.yml` on master stops Jekyll publishing the notes files on the live domain.

### Being built: branch `astro-rebuild` (multi-page Astro site)

- **Never merge `astro-rebuild` into `master` before the cutover.** The branch moves the one-pager into `legacy/`, so GitHub Pages would serve a broken site. The order is in `docs/multi-page-proposal.md`.
- Astro 7 static site. `npm run build` = `astro build` + `scripts/check-site.mjs`. Output `dist/`.
- All business facts live in `src/site.ts`; the licence line is `src/components/LicenceLine.astro` (top bar) and the footer, both from `src/layouts/Base.astro`, so every page gets them.
- Content: `src/content/work/` (case studies, `draft: true` by default) and `src/content/gallery/` (photos, `hidden: false` by default; trade groups in `src/content.config.ts`). Photos for them live in `src/assets/work/` and `src/assets/gallery/`, optimised by Astro (AVIF/WebP).
- **Held-back photos:** Astro copies the original of *every* image a content entry points at into `dist/_astro`, even when the page filters the entry out. `scripts/held-back.mjs` + the `drop-held-back-photos` integration in `astro.config.mjs` delete originals used only by hidden gallery items or draft case studies, and the check script fails the build if one is left. Don't remove either.
- Decap CMS at `/admin/` (`public/admin/config.yml`): GitHub backend on `master`, editorial workflow (Nat's edits wait for Mitch), sign-in through the existing `sth-oauth` Worker. It only works once the Astro site is on `master`, and Nat needs a GitHub account with write access.
- Contact form: `functions/api/contact.js` (Pages Function). Sending is OFF unless `CONTACT_SEND_ENABLED=true`; while off it logs the submission and shows the thank-you page. Honeypot field `website` + Cloudflare Turnstile (test keys until real ones are set). Sends with Microsoft Graph from info@ to info@. Settings listed at the top of the file.
- `public/_redirects`: old Squarespace and old one-pager URLs. Old one-page anchors `#about-h` and `#contact-h` are redirected by a small script on the home page.
- Gotcha: after deleting a photo that a content entry used, a build can fail with `ImageNotFound` from a stale cache. Fix: `rm -rf .astro node_modules/.astro` and build again.

## Previews

GitHub Pages has no branch previews, so previews go to the Cloudflare Pages **direct-upload** project `sunshine-built-preview` (production branch `production-unused`, so every upload is a preview). Preview URLs get `X-Robots-Tag: noindex` automatically.

Astro branch (from the repo root, so `functions/` is included):

```
cd ~/repos/sunshine-built && npm run build && npx wrangler pages deploy dist --project-name sunshine-built-preview --branch <branch-name> --commit-dirty=true
```

One-pager branches (`master`-based):

```
cd ~/repos/sunshine-built
D=$(mktemp -d)
git archive HEAD -- 404.html CNAME images index.html robots.txt sitemap.xml | tar -x -C "$D"   # site files only, never the notes
npx wrangler pages deploy "$D" --project-name sunshine-built-preview --branch <branch-name> --commit-dirty=true
```

Preview address: `https://<branch-name>.sunshine-built-preview.pages.dev`. Run wrangler from the repo, never from `~`. Never use `--branch production-unused`.

## Checks before saying done

- Astro branch: `npm run build` must end with "All checks passed." Then `npx wrangler pages dev dist` (stop it by PID afterwards, and the `workerd` child too) and screenshot every page at 390 × 844 and 1366 × 680: no horizontal scroll, licence line readable in the top bar and footer.
- One-pager: serve locally (`python3 -m http.server`, stop it by PID) and screenshot at the same two widths.
- Photos: no people, number plates, house numbers or street views. Captions about the trade only: never a suburb, address or client name, and never "renovation" unless it was one.
- Live check after an approved deploy: `curl -s https://www.sunshinebuilt.com.au/ | cmp - index.html`.
