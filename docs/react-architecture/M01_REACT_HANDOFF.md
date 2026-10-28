# M01 React Visual Candidate — engineering handoff

## Context and boundaries
- Source baseline: `fix/m01-poster-ink-orbits` poster markup and historical **1672×941** screenshot, captured from `experiments/m01-v3-poster-v2/`.
- Historical approved M01 V3: `experiments/m01-v3-art-motion/` / `m01-v3-visual-approved` remains **untouched**.
- Approved knowledge V5 and root legacy V4: **untouched**.
- This new candidate is an independent React experiment **draft**, not a replacement of M01 V3 and not approved for production.
- User's original **PNG** named `docs/design-references/m01-poster-v2-target.png` is **not available** in checked project context and repo. Historical JPG is an engineering proxy; do not rename it to the target or present proxy comparison as true 1:1.

## Architecture
```
apps/portfolio-react/
  src/app/                  # site shell / navigation / M01→M02 placeholder
  src/modules/m01/          # separate M01 components, layout CSS, source assets
    components/             # editable typography, photo, SVG curves, art details
    assets/                 # portrait JPEG? actual: WebP, erosion PNG
  src/shared/animation/     # GSAP timeline settings
  src/shared/navigation/    # one gesture / one page, owned by site shell
  src/remotion/             # independent frame-based cinematic rehearsal
  tests/                   # Playwright layout/gesture/screenshot
  visual/                  # historical reference proxy, overlays and diffs
```

## Design decisions
- Coordinates retain historical poster CSS values for a 1672×941 artboard. Desktop uses uniform scale, tablet/mobile use responsive overrides.
- Portrait remains an independent high-resolution WebP; geometry, text and SVG paths are not flattened to one background.
- GSAP animates title reveals and SVG stroke drawing; Motion operates only the light hover preview. Remotion has a distinct `M01PosterEntrance` composition, never an app scroll controller.
- Router is currently two-scene section navigation, not fake full-site M02. `usePageNavigation` is owned by the site shell and can be replaced with router-level control when further modules are approved.
- No Three.js: no justified 3D scene at this stage; include only when a real module needs it.
- Scoped app runs at `preview/m01-react/`. It does not load globally into frozen pages.
- `?static=1` disables title animation to allow deterministic captures.
- `module.json` remains draft; no approved tag or module-registry promotion without user acceptance.

## Evidence and acceptance
- Screen sizes: 1672×941, 1440×900, 768×1024, 390×844, 320×680.
- Historical proxy has a compressed JPG baseline: pixel errors measure proxy differences **not target differences**.
- Visual comparison script outputs transparent overlay + contrast-amplified diff; report color error and any remaining mismatch.
- Run: `cd apps/portfolio-react && pnpm install && pnpm build && pnpm test && pnpm test:browser && python3 visual/compare.py`.
- Frozen repo modules: `node scripts/validate-modules.mjs` and `git diff origin/main --name-only`.

## Explicit unresolved items
1. Original reference PNG absent; cannot report 1:1 pass or commit source-provided master at specified path.
2. Source historical portrait is 1086×1448 WebP; original independent master and commercial status are not verified.
3. Historical mountain is CSS geometry, not a separately sourced photographic mountain collage. True source-fidelity depends on reference PNG and assets.
4. Full M02/module integration requires separate design approval.
