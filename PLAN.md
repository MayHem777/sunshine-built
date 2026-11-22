# PLAN: Sunshine Built website

## Goal
A truthful, compliant website for Sunshine Built (licensee M.J. Croft Pty Ltd ATF The Croft Trust, QBCC 15205110) that brings in building enquiries, and that Nat can update without a developer.

## Next steps
1. DONE 2026-11-22: licensee name + "since 2004" wording live (master b7ad5ac, live page matches, notes files not served).
2. Multi-page site: approved in principle (2026-11-22) but NOT to be built until 3 real finished jobs with photos are gathered. Decisions in `docs/multi-page-proposal.md`.
3. When the jobs are in: build the Astro site on a branch, Git-connected Cloudflare Pages project `sunshine-built`, previews per branch.

## Assumptions
- 2026-11-22: licensee name "M.J. Croft Pty Ltd ATF The Croft Trust" confirmed by Mitch (Notice of Cover names M.J. CROFT PTY LTD).
- 2026-11-22: "since 2004" wording replaced every business-age claim, not only the hero: meta/social descriptions, schema description, About section and facts list said the same thing.
- 2026-11-22: licensee shown in the top strip (small, above the fold), as a full readable line under the hero buttons, in the footer, on the 404 page, and as `legalName` in the schema data.
- 2026-11-22: previews use a separate direct-upload Pages project `sunshine-built-preview`, so the name `sunshine-built` stays free for the future Git-connected project.
- 2026-11-22: the brief said "match MayHem777/sunshine-tiny-houses", but that repo is the Squarespace code-block landing page. The Astro + Decap + Cloudflare site is MayHem777/STH-Website; the proposal follows STH-Website.

## Waiting on Mitch
- Gather 3 real finished jobs with photos (suburb, scope, year) before the multi-page build starts.
