# Sunshine Built website

Website for **www.sunshinebuilt.com.au**. Read this file and `PLAN.md` before changing anything.

## The business

- **Sunshine Built** is a trading name of **M.J. Croft Pty Ltd ATF The Croft Trust**.
- ABN **40 270 427 080** · QBCC licence **15205110** · based in **Noosaville QLD**.
- Phone 0401 744 844 · info@sunshinebuilt.com.au (Microsoft 365 mailbox).
- Licensed builder: new homes, renovations and extensions, insurance repairs, shop fit-outs, carpentry and decks, custom saunas, across Noosa and the Sunshine Coast.
- Sister company: Sunshine Tiny Houses (modular homes, granny flats, tiny homes; sunshinetinyhouses.com.au). Modular work is referred there; conventional on-site building stays with Sunshine Built.

## Rules (do not break)

1. **Licensee name and QBCC number sitewide.** Every page (including the 404 page and any thank-you page) shows the licensee name *M.J. Croft Pty Ltd ATF The Croft Trust* together with *QBCC licence 15205110*, legible (body-size text, good contrast, not a tiny grey mono label alone) and reasonably prominent: in the header or hero area and in the footer. Check it on a phone width before calling any change done.
2. **Real content only.** No invented projects, photos, reviews, testimonials, star ratings, awards, statistics or client names. If content is missing, leave a clear placeholder in the branch and list it under "Waiting on Mitch" in `PLAN.md`; never fill it with something made up. Stock or template sample pages (the old Squarespace site had template pages such as `/float-house`, `/cultural-center`, `/greenspacing`) are not our projects.
3. **Australian English and metric units only** (mm, m, m²). Never show imperial.
4. **Never assume anyone's gender**; use names, roles or "they".
5. **Workflow:** work on a feature branch, never on `master`/`main`. Publish a preview URL and show it to Mitch. Merge and deploy to production **only after Mitch approves in that session.** Never force-push.

## How it is built and hosted today (checked 2026-11-22)

- Single page: `index.html` (inline CSS, schema.org JSON-LD), `404.html`, `robots.txt`, `sitemap.xml`, `images/`. No build step.
- Hosted on **GitHub Pages**, legacy build from branch `master`, path `/`. `CNAME` = `www.sunshinebuilt.com.au`. HTTPS enforced; the GitHub certificate renews itself.
- **Pushing to `master` deploys to the live site within a minute.** That is a hard stop: Mitch's OK first.
- The repo is **public** (GitHub Pages on a free plan needs it).
- DNS: nameservers `ns1-3.nameserver.net.au` (VentraIP, managed in VIPControl). Apex has the four GitHub Pages A records (185.199.108-111.153) and 301s to `www`; `www` is a CNAME to `mayhem777.github.io`. Mail: MX `sunshinebuilt-com-au.mail.protection.outlook.com`, SPF `include:spf.protection.outlook.com -all`, TXT `MS=ms28511729`. Never touch the mail records.
- `_config.yml` stops Jekyll (GitHub Pages) publishing `CLAUDE.md`, `PLAN.md`, `docs/` and `monitor.json` on the live domain. Add any new non-site file to its `exclude` list.
- Branch `full-site-wip` (remote only) holds an older multi-page draft (about, services, gallery, contact, thank-you). It is not deployed and predates the current one-pager.

## Previews

GitHub Pages has no branch previews, so previews go to the Cloudflare Pages **direct-upload** project `sunshine-built-preview` (production branch set to `production-unused`, so every upload is a preview). Pages preview URLs get `X-Robots-Tag: noindex` automatically.

```
rm -rf /tmp/sb-preview && mkdir /tmp/sb-preview && git archive HEAD | tar -x -C /tmp/sb-preview
rm -rf /tmp/sb-preview/{CLAUDE.md,PLAN.md,docs,monitor.json,_config.yml}
cd ~/repos/sunshine-built && npx wrangler pages deploy /tmp/sb-preview --project-name sunshine-built-preview --branch <branch-name>
```

Preview address: `https://<branch-name>.sunshine-built-preview.pages.dev`. Run wrangler from the repo, never from `~`. Never use `--branch production-unused`.

## Checks before saying done

- Serve locally (`python3 -m http.server`, stop it afterwards by PID) and screenshot at 390 × 844 and 1366 × 680: no horizontal scroll, licensee line visible and readable in the hero and the footer.
- Live check after an approved deploy: `curl -s https://www.sunshinebuilt.com.au/ | cmp - index.html`.
