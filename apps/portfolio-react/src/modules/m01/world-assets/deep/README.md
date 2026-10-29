# M01 deep scene assets

This development package contains the source-pixel layer sets for the WITHIN and BEYOND scenes. Each world currently has 40 crop-tight RGBA image units, semantic groups, original-canvas bounds, parent/occlusion references, motion capability notes, mask confidence, semantic depth, and paint order. The original flattened references remain the locked visual baseline in `../assets/`.

## Layer rendering

- `within/layer-manifest.json` and `beyond/layer-manifest.json` are the layer source of truth.
- WITHIN's runtime plate, `within/base-with-transparent-holes.png`, clears the union of all 40 layer alpha masks from the flattened source. The former full-image plate remains preserved as `within/source-background-before-fill.png` for reference and comparison.
- BEYOND's runtime plate is `beyond/base-with-transparent-holes.png`; its transparent pixels also align with the union of its layer masks.
- WITHIN `renderOrder` preserves the exact flattened paint order. Its `depth` values are semantic depth bands and do not replace paint order.
- BEYOND `z` values are used as paint order; they are also exposed as semantic depth where no separate `depth` exists.
- React flattens groups for CSS painting while retaining ancestry metadata and applies nested transforms as a composed matrix. This avoids turning each moved group into a CSS stacking context that would change interleaved occlusion.
- Inspector-only routes are `?world=within&view=layers&inspect=1` and `?world=beyond&view=layers&inspect=1`.

## Inferred fill candidates

`fill-under-manifest.json` describes ten local ShiftMap fill-under candidates. Assets are crop-tight and mask-limited. Every opaque fill pixel is inferred; no hidden source pixel can be verified from the flattened reference. The package records confidence, motion limits, and static reconstruction / outside-mask change counts.

Candidates are off by default and appear only when the Inspector's **显示此层推测补全** control is enabled for the selected image. The patch remains at its original canvas position while that image moves. This allows one-layer tests without changing the ordinary static scene. It is not a globally coherent clean plate: overlapping ownership and hidden background geometry still need review, especially for paper, illumination, title, mountain and cloud units.

## Baseline and testing

The normal scene render uses an alpha-holed reference-derived background and the source-pixel layer assets. With every transform at its origin and inferred fill hidden, the composite is expected to match the browser-decoded reference exactly. The inspector includes reference, difference, alpha, visibility, opacity, transform, bounds, and reset controls. Motion testing is exploratory; static pixel equality does not certify that a moved layer's surrounding hidden background is factual or plausible for large travel.
