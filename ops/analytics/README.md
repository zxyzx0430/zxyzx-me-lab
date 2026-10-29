# OPS01 · Multi-site analytics adapter (draft)

Reusable browser SDK using the **PostHog JavaScript SDK**. It does not create its own database, dashboard, authentication system, or tracking endpoint.

## Status
- **Code ready / not collecting live data.** The public PostHog project token is not configured. Until supplied, init returns false and makes no analytics requests.
- Personal sites supported: `zxyzx.me` and `ai.zxyzx.me`. More hosts can be added to `allowedHosts`.
- Preview and localhost are blocked by exact hostname allowlists and `environment: 'production'`.
- No session replay, recording, form value capture, raw IP storage, query parameter capture or automatic element autocapture.
- Tracking requires a positive opt-in consent from the visitor; visitors can decline.
- One PostHog project for connected sites with `site_id` to segment metrics.

## Development
```sh
cd ops/analytics
npm ci
npm test
npm run build
```

The generated release `dist/ops01-analytics.v0.1.0.js` is a standalone version-pinned browser IIFE. It exposes `window.OPS01`. Never place PostHog **personal API keys** or **secret keys** into site code; only public **project tokens** are appropriate.

## Embedding

Each site's HTML includes only the lightweight configuration script:

```html
<script defer src="./ops01-config.js"></script>
```

At build time, install `public/ops01-config.js` and set the PostHog **public** project token only after the owner has created a project. The configuration script checks the current production hostname and token, then lazily loads the pinned hosted SDK. When the token is blank, **no analytics bundle or network request is loaded**.

```js
const TOKEN = ''; // owner inserts public phc_ token
const API_HOST = 'https://us.i.posthog.com'; // project region
const allowedHosts = ['zxyzx.me', 'www.zxyzx.me']; // AI site uses ai.zxyzx.me
// Loader then calls OPS01.init({siteId, token:TOKEN, apiHost:API_HOST, allowedHosts, environment:'production'})
```

Track page views (consent-only), entering/leaving sections, CTA clicks (elements marked `data-ops-event="cta_click"` and `data-ops-target="some-slug"`), and links from one zxyzx.me subdomain to another. The final observed section is an estimate of exit location, not a guaranteed browser-close signal.

Annotate sections with `data-ops-section="m01"` etc. or use `main section[id]`. Single-page applications may also call `window.OPS01.sectionEnter('m02')` when the actual page transition completes.

Visitors can withdraw at any time with `OPS01.setConsent(false)`. The default UI presents **同意 / 拒绝** when the token and production host are configured. Add a visible privacy-settings control to sites before public activation; a UI code example is in `docs/ops01/`.

## Config and dashboards
See `../../docs/ops01/SETUP.md` for dashboards, QA, privacy and rollout. PostHog project creation and live event delivery cannot be verified without the owner's connected account/project token.
