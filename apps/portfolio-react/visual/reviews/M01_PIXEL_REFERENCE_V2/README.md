# M01 Pixel-Locked Reference Baseline

**Status:** preserved static comparison baseline; waiting for layered-scene review. It is not the final animated scene and is not approved for production deployment.

## Routes

- `/?world=within` — WITHIN reference image
- `/?world=beyond` — BEYOND reference image

The complete PNG is the only visible artwork on these routes. The 16:9 canvas fits inside the viewport without cropping; transparent keyboard-accessible hotspots return to the existing M01 homepage or switch worlds.

## Source references

The browser renders the supplied PNG files directly from `src/modules/m01/assets/`:

- `within-target-1536x864.png` — SHA-256 `17a912b119d78e9466318f8d2138a4d4a0c1835e975d27aec5457fe24fdbf39a`
- `beyond-target-1536x864.png` — SHA-256 `e6ab22728fa5a4eeb2180990a591fbcaca11940b18c2b29e7910332f3742cd53`

The previous V1 route design notes remain in `../M01_WITHIN_BEYOND_STATIC_V1.md` as historical context; its substitute photography and reconstructed collage are not used in this baseline.

## Browser comparison

Captured from the production Vite preview with Chromium `147.0.7727.15`, viewport `1536 × 864`, and `deviceScaleFactor = 1`.

| Scene | Changed pixels | Exact pixels | RGB MAE / 255 | Max channel error |
| --- | ---: | ---: | ---: | ---: |
| WITHIN | 0 / 1,327,104 | 100% | 0 | 0 |
| BEYOND | 0 / 1,327,104 | 100% | 0 | 0 |

Both image assets loaded at their native `1536 × 864` size. The browser audit recorded no HTTP failures, failed requests, console errors, or page errors. The canvas also retained 16:9 proportions at `1920 × 1080` and `390 × 844`.

The app build, 5 existing Vitest tests, and root module validation passed. The existing broader Playwright suite passed 14 of 16 tests on its first run. Its mobile recording case passed when rerun alone; one untouched homepage cinematic assertion still fails because `.word-explore` computes to `matrix(1, 0, 0, 1, 0, 0)` instead of `none`. The homepage and its motion code were not changed here.

Browser captures and the raw audit record are committed alongside this file. Side-by-side, 50% overlay, and pixel-difference images are delivered in the task's `outputs/M01-static-visual-review/` folder.

## Boundary

This baseline stays available as the exact visual oracle while a separate React layer view is built. No GSAP, camera movement, particles, parallax, or other scene motion is included in this version. The existing M01 homepage, V1 online review, and `zxyzx.me` deployment were not changed.
