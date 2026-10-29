# M01 WITHIN / BEYOND — static reference-based React endpoints

**Status:** Visual review V1 / not production approved.
**Date:** 2026-10-29
**Reference images:** attached user targets 11592.png (WITHIN), 11594.png (BEYOND).
**Source baseline:** production commit 6f4b943.
**Branch:** feat/m01-static-within-beyond-approved-refs.

## Visual targets and implementation

### WITHIN
- Left torn ivory paper and black-white photographic collage, oversize ink-eroded WITHIN type, right-hand shaft of light, real photographed rear-facing observer, editorial typography and survey lines.
- Live HTML: masthead, subtitle, Chinese explanation, archive labels, and giant title.
- SVG: target geometry and orbital lines; independent, non-animated.
- Layers: paper, mountain photography, cloud textures, typography, tears, light, observer, annotation.

### BEYOND
- Broad left mountain-to-right city panorama, giant rough BEYOND type, torn bottom-black and paper, magazine annotations, thin orbit lines.
- City and mountains are separately masked image layers; not a stitched copy of either whole target image.
- Live HTML: title, subtitle, archive numbers, Chinese copy and navigation.

## Interaction boundary
- Direct routes: /?world=within and /?world=beyond.
- Direct transitions only; no GSAP sequence, camera travel, particles, parallax or animated rails.
- Home route / remains the baseline M01 Hero. Navigation labels update to WITHIN/BEYOND; ?static=1 keeps the exact reference navigation.
- Existing M01 intro and future page2 are not edited.
- Mobile/desktop use separately styled spatial compositions; no full poster bitmap stretched.

## What is NOT yet equal to the targets
1. Target illustrations are **not** included as single-page backgrounds. Specific photographic subjects are substitute reusable photographs, not extracted pixel-matching target layers; architecture and light have been re-composed.
2. WITHIN original image has deeper rock-letter topology and the figure in a long black coat; the prototype uses a licensed photographed traveler silhouette and separate existing M01 portrait fragment.
3. BEYOND reference city blends into the cloud sea more naturally; target-specific photomontage edges and subtle tear silhouettes remain partially approximate.
4. Extra-large letterforms have ink erosion and independent masking, but the original reference's exact custom letter outlines have not been traced.
5. All true page typography and annotations remain editable and responsive.

## Asset provenance
- Reused original M01 project master-paper-tile, ink-erosion, master-mountain and original portrait.
- Supporting licensed Unsplash photography fetched from images.unsplash.com:
  - photo-1464822759023-fed622ff2c3b (mountain)
  - photo-1500534623283-312aade485b7 (alpine horizon)
  - photo-1477959858617-67f85cf4f1df (city)
  - photo-1534088568595-a066f410bcda (cloud)
  - photo-1706818433340-d3542769a78a (observer)
  - photo-1760784062757-b2241776c207 (black-and-white rock canyon)
- All images are locally bundled, graded monochrome; no external runtime image calls.

## Tests
- TypeScript and Vite build
- 5 existing Vitest tests
- Chromium on 1920x1080, 1536x864, 1440x900, 390x844, 768x1024
- No console page errors / no horizontal overflow
- Original homepage ?static=1 vs live 6f4b943 pixel comparison

## Approval
These are actual web pages and screenshots for visual review, **not** final approved pages. Do not merge this branch or deploy to zxyzx.me. Next iteration should tune reference-specific typography and photo masks after user reviews screenshots.
