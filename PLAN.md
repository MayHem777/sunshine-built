# PLAN: Sunshine Built website

## Goal
A truthful, compliant website for Sunshine Built (licensee M.J. Croft Pty Ltd ATF The Croft Trust, QBCC 15205110) that brings in building enquiries, and that Nat can update without a developer.

## Next steps
1. Mitch reviews the licensee fix on branch `licensee-name` (preview https://licensee-name.sunshine-built-preview.pages.dev). On approval: merge into `master` and push (this deploys live), then `curl` check.
2. Mitch decides on the multi-page proposal in `docs/multi-page-proposal.md`.
3. If approved: build the Astro site on a branch, Git-connected Cloudflare Pages project `sunshine-built`, previews per branch.

## Assumptions
- 2026-11-22: licensee name shown as "M.J. Croft Pty Ltd ATF The Croft Trust" exactly as Mitch gave it; not yet checked against the name printed on the QBCC licence record.
- 2026-11-22: licensee shown in the top strip (small, above the fold), as a full readable line under the hero buttons, in the footer, on the 404 page, and as `legalName` in the schema data.
- 2026-11-22: previews use a separate direct-upload Pages project `sunshine-built-preview`, so the name `sunshine-built` stays free for the future Git-connected project.
- 2026-11-22: the brief said "match MayHem777/sunshine-tiny-houses", but that repo is the Squarespace code-block landing page. The Astro + Decap + Cloudflare site is MayHem777/STH-Website; the proposal follows STH-Website.

## Waiting on Mitch
- Approve `licensee-name` for merge + live deploy.
- Confirm the licensee name matches the QBCC licence record word for word.
- Decisions listed at the end of `docs/multi-page-proposal.md`.
