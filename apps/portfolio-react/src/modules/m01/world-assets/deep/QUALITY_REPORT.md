# M01 deep-layer static acceptance

## Scope

This is the static, animation-capable layer milestone for the WITHIN and BEYOND worlds. The approved 1536×864 source images remain the locked baseline. No GSAP timeline, camera transition, or production deployment is included.

## Scene assets

- WITHIN: 40 crop-tight RGBA source-pixel units in 8 semantic groups.
- BEYOND: 40 crop-tight RGBA source-pixel units in 14 semantic groups.
- Both manifests record parent groups, original canvas bounds, semantic depth, paint order, occlusion references, fill requirements, source provenance, mask confidence, motion capabilities, and limitations.
- Both worlds' 40 alpha masks are pairwise disjoint. The runtime plates contain transparent holes exactly under their layer masks. The original complete references remain preserved separately.
- React renders image leaves in global paint order and composes nested group transforms into each leaf transform. This keeps interleaved paint order when a parent group moves.

## Browser verification

Chrome / Playwright at 1536×864 and device scale factor 1:

| Check | WITHIN | BEYOND |
|---|---:|---:|
| Layer units loaded | 40 / 40 | 40 / 40 |
| Static layered composite changed pixels | 0 / 1,327,104 | 0 / 1,327,104 |
| Failed image requests | 0 | 0 |
| Browser console / page / request errors | 0 | 0 |
| Inspector reset changed pixels | 0 | 0 |
| Root group descendants | 40 | 40 |

The normal static composition matches the browser-decoded target exactly. The original target files have a `.png` filename but identify as JPEG streams; the current Chrome and Pillow decoders produce identical comparison pixels for these files.

Key motion units were tested at ±30, ±80, and ±150 px on both axes: 156 fill-off frames across the two worlds. Every frame changed, every reset returned exactly to the rest image, and no changed pixels were found outside the tested layer's source/destination alpha bounds.

The 1920×1080 canvas remains 16:9 at 1920×1080. At 390×844, the 16:9 canvas is fully contained at 390×219.375 with no horizontal overflow.

## Inferred fill-under candidates

Ten crop-tight optional ShiftMap patches are included: five per world. They are disabled by default and can be previewed for the selected layer in Layer Inspector. Each patch's alpha matches its source layer mask; browser checks found zero changed pixels at the rest pose when enabled. Patch z-index and DOM adjacency were verified.

Five representative candidates were moved at ±30/80/150 px in four directions (60 frames). All frames changed and all resets returned exactly to the fill-on rest image. These checks validate the React controls and compositing only; they do not verify the hidden scene content.

Every fill pixel is inferred. Patches repair only the layer's original footprint; a moved layer can reveal holes at its new destination. Visual review found repeated texture, seams, or mixed-content artifacts in some paper, title, mountain, city, cloud, and broad-light motions. They are local experiments, not a globally coherent clean plate and not recovered source photography.

## Current limits

- The 40 image units per world provide independent transforms and semantic parent groups, but several visual cuts still combine paper, photo texture, and type. Further ownership refinement is needed before large travel or camera-through-letter shots.
- Alpha masks currently partition the image, so they do not yet model objects passing in front of and behind one another through separate occlusion slices.
- There are only ten local inferred fill candidates. Other units expose transparent holes when moved.
- No formal cinematic motion is implemented. Keep this milestone frozen until the user reviews the layered static frames and the optional fill experiments.

## Developer routes

- `?world=within&view=layers` — WITHIN layered scene.
- `?world=beyond&view=layers` — BEYOND layered scene.
- Add `&inspect=1` to enable the development-only Layer Inspector.

The static reference route remains available without `view=layers`.
