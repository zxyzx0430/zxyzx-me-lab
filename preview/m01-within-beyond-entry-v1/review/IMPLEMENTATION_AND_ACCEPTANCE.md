# M01 · WITHIN / BEYOND — Real-Poster Entry Prototype

Status: **REVIEW ONLY; NOT APPROVED FOR PRODUCTION**. Date: 2026-10-29.

## Source of truth
- Formal site: https://zxyzx.me
- Verified deployed release: /var/www/zxyzx-me/releases/m01-20261029-6f4b943-soft-collage
- Exact source commit: 6f4b943; no merge of later visual experiments
- Isolated development: feat/m01-within-beyond-real-transition-v1
- React app: apps/portfolio-react/

## Stage 1
- Real 向内 / 向外 artword hotspots with restrained focus/hover.
- Nav WITHIN / BEYOND dispatches the exact same entry event.
- Brand and Escape restore the original artboard without replaying intro.
- ?static=1 remains the unchanged visual baseline and retains reference navigation.

## Stage 2 — proof, NOT end scenes
- 1.20-second first camera move, anchored dynamically to actual word bounding rect.
- The real M01 PNG word and SVG track remain visible beneath transition.
- WITHIN: scaling through ink strokes; evolving paper-wall slit based on the same lens progress.
- BEYOND: following original path M496 806 C558 712 619 614 678 545, growing its exact-coordinate extension; separating paper layers.
- The textured transition planes use only existing M01 paper/letter/mountain artwork, no foreign cavern or futuristic city render.
- The last frame intentionally stops at the start of penetration. WITHIN/BEYOND destination scenes have **NOT** been designed.
- Scrubbable timeline, immediate skip, Escape/brand return, keyboard buttons, touch-capable hotspots, reduced-motion no-tween branch.

## Testing
- pnpm build: passed (TypeScript + Vite).
- pnpm test: 5/5 passed.
- Chromium responsive checks: 1440×810 and 390×844.
- Both routes: entry, progress=100, Escape reset stage transform=none, no horizontal overflow.
- Browser console page errors: 0.
- Exact Chromium static screenshot comparison (source site vs dev): 0 / 1,166,400 changed pixels at 1440×810 and pixelmatch threshold .1.
- Videos: actual Chromium frame capture in Playwright, trimmed to entry duration (2.0 s files).

## Known limits / pending approval
1. This is a **live-DOM 2.5D entry prototype**, not 3D material simulation. It proves continuity of source elements but not yet the full typography-to-geological-space metaphor.
2. Road-to-landscape transition has not been fully completed; only the first 1.2 seconds are implemented.
3. No WITHIN/BEYOND end pages, second-screen redesign, production deployment, DNS or domain changes.
4. Future refinement should be performed only against the existing source artwork and verified at 0.25 / 0.5 / 0.8 / 1.2 seconds before adding any destination designs.
