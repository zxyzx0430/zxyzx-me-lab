# M01 · Home Hero V1 / 「忠心于中心」

**Status: DRAFT · user review required** | version **0.1.0**

## Scope and intent

First independent, reusable cinematic home opening. This is **not** a new complete homepage, not M02 Works, and not the production website. The approved Knowledge Network V5 and root V4 remain untouched.

### Locked decisions from design discussion

- Primary identity: **忠心于中心**. `zxyzx.me` is a digital address, not the name of the logo.
- Slogan (exact): **向内寻找中心，向外探寻世界**.
- Logo philosophy: full Chinese wordmark + future custom `中` axis / `心` integrated glyph. V1 temporary typographic glyph is **not the approved logo**.
- Hero: real person first; calm portrait + experimental typography + spacious cinematic lighting.
- Visual hierarchy: one portrait; two independent oversized text movements representing inner and outer; close-to-still ending.
- Desktop and mobile must have distinct responsive layouts.
- Independent module: no global CSS, script variables, global navigation implementation or dependency on other modules.
- Assets: `assets/portrait-cinematic-enhanced.webp` is a compressed cinematic concept portrait based on the user's own three photographs, **not a claim of an unaltered photo**. Replace this independent asset later with higher-resolution reviewed art if approved.

### Files

```text
modules/home-hero/
├── index.html                  standalone page + transition *boundary*
├── module.js                   Web Component, animated hierarchy, events
├── module.css                  Shadow DOM isolated CSS
├── module.json                 status, version, interface
├── assets/portrait-cinematic-enhanced.webp
├── README.md
└── tests/...
```

## Preview and usage

Preview: `https://zxyzx0430.github.io/zxyzx-me-lab/modules/home-hero/`

Plain HTML:

```html
<script type="module" src="./modules/home-hero/module.js"></script>
<zxyzx-home-hero></zxyzx-home-hero>
```

Custom element has no independent nav bar. The preview shell supplies its own nav to demonstrate a future global layout. It includes the white `#m01-exit` section solely to test the transition toward a future M02; **M02 itself is not yet designed**.

API:
- `hero.replay()` reruns opening sequence; `hero.setMotion(false)` disables motion and `hero.motionEnabled` gives current state.
- Events with prefix `home-hero:`: `ready`, `enter`, `exit`, `motion`, `explore`, `error`.
- `prefers-reduced-motion` respected; document scroll and resize listeners removed when disconnected.
- Image uses `import.meta.url` relative URL. Shadow DOM protects global styles.
- Web layout host owns `#m01-exit` and navigation destinations.

## Acceptance criteria

- Screen sizes 320×680, 390×844, 768×1024 and 1440×900: no horizontal overflow, face visible, hero headline readable, nav and scroll CTA accessible.
- On entering: text and portrait reveal without blocking interaction. On scrolling: independent layers retreat, then white next-chapter demo appears.
- Click WORK / ABOUT / INFO / REPLAY / MOTION and verify effect, not dead buttons.
- Check no JS errors, image loads (HTTP 200), prefers-reduced-motion removes motion, JS memory/event cleanup.
- `node scripts/validate-modules.mjs` passes and `node --test modules/home-hero/tests/*.test.mjs` passes.
- Run Github Pages after upload. Do not deploy to zxyzx.me or integrate root index.html before user accepts.

**Visual V1 remains experimental.** Only the user can approve/freeze it. Preserve a future reviewed V2 separately.
