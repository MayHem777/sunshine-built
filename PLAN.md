# PLAN: Sunshine Built website

## Goal
A truthful, compliant website for Sunshine Built (licensee M.J. Croft Pty Ltd ATF The Croft Trust, QBCC 15205110) that brings in building enquiries, and that Nat can update without a developer.

## Next steps
1. DONE 2026-11-22: licensee name + wording ("On the tools since 2004", "QBCC licensed and insured") live on master (70d6e14).
2. **Build hold lifted (Mitch, 2026-11-22): build what we can now.** Multi-page Astro site on branch `astro-rebuild`, preview https://astro-rebuild.sunshine-built-preview.pages.dev. Pages, CMS, form (sending off), redirects, schema and checks are done.
3. Photos and the Ninderry write-up are BLOCKED: Claudio can't read the NAS share (see Waiting on Mitch). Once unblocked: copy + unzip `STH/_Claude/Sunshine Built/sunshine-built-site-photos.zip` into `src/assets/gallery/`, one `src/content/gallery/*.md` per photo with honest trade captions (captions.csv column 3 is an internal note), crop the watermark on A9, skip A10, E1–E4 as `hidden: true`; pick 8–12 finished Ninderry photos (NAS folders listed in `notes.local.md`, git-ignored because the repo is public) (no people, plates, house numbers, street) and write the case study from the job files.
4. Cutover (later, each step asks Mitch): follow `docs/multi-page-proposal.md`.

## Assumptions
- 2026-11-22: licensee name "M.J. Croft Pty Ltd ATF The Croft Trust" confirmed by Mitch (Notice of Cover names M.J. CROFT PTY LTD).
- 2026-11-22: "since 2004" wording replaced every business-age claim, not only the hero: meta/social descriptions, schema description, About section and facts list said the same thing.
- 2026-11-22: licensee shown in the top strip (small, above the fold), as a full readable line under the hero buttons, in the footer, on the 404 page, and as `legalName` in the schema data.
- 2026-11-22: previews use a separate direct-upload Pages project `sunshine-built-preview`, so the name `sunshine-built` stays free for the future Git-connected project.
- 2026-11-22: the brief said "match MayHem777/sunshine-tiny-houses", but that repo is the Squarespace code-block landing page. The Astro + Decap + Cloudflare site is MayHem777/STH-Website; the proposal follows STH-Website.

- 2026-11-22: Decap signs in through the existing `sth-oauth` Worker (it isn't tied to one repo, and nothing STH-branded shows on the site) rather than a new OAuth app and Worker.
- 2026-11-22: New homes page is a stub: noindex, not in the menu, footer or sitemap, until Mitch confirms the service.
- 2026-11-22: Sister-company referral (Sunshine Tiny Houses) kept as a small text box on Home and a line on About, as on the live site. No STH logo or copy.
- 2026-11-22: Contact form needs a phone number; email is optional (tradie-friendly). Fields: name, phone, email, suburb of the job, type of job, message.
- 2026-11-22: Turnstile uses Cloudflare's test keys on the preview; real keys are a switch-on item.
- 2026-11-22: Privacy page written in plain English, marked for Mitch to check; not legal advice.

## Waiting on Mitch
- **NAS access for photos (blocker):** the share `//192.168.50.244/STH` is mounted by the Sunshine Files service as user `sunfiles` (files 0440, credentials in root-only `/etc/sunshine-files/smb.cred`); Mitch's login on Claudio can't read it and sudo needs a password. Options in the build summary.
- Every [MITCH: ...] placeholder (the check script lists them on each build).
- Contact form switch-on (Microsoft send-only app, Turnstile keys): list in `docs/contact-form-switch-on.md`.
- Gather client permission for the Ninderry case study; finished-store photos + client OK for the Noosa fit-out.
