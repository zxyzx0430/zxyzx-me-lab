# OPS01 · 多站点统一分析系统 / 部署与验收

## 目标与边界
- 覆盖 `zxyzx.me`、`ai.zxyzx.me` 和以后新增的同域子站；前端技术可以是 React / 静态 HTML / 其他框架。
- 一个 PostHog **production project**；使用 `site_id` 分站点，`hostname` 分域名。利用 PostHog 现成 Dashboard、Funnels、Web Analytics，不自建数据库/后台。
- 自建最小浏览器接入包：`ops/analytics/`。冻结版本 `v0.1.0`，其他站点加载相同压缩文件。
- 统一处理 anonymous pageview、section enter/leave、CTA click、cross-subdomain click。
- 不识别真人、没有 IP 精确地址功能。PostHog 推测国家/地区/城市，不是精确住址。
- 关闭会话回放、输入框抓取、表单自动捕获、查询串、原始 referrer。
- 访问者选择同意后才启动采集；拒绝或未配置 token 时不采集。对教育站要仔细审查告知、未成年人相关合规。
- 本次不配置分析平台账号，也不收集、保存任何密钥。PostHog public project token（`phc_...`）可出现在前端；个人 API key 不可出现。

## 站点与部署
| Site ID | Domain | Repo | Integration |
|---|---|---|---|
| `personal` | `zxyzx.me`, `www.zxyzx.me` | `zxyzx-me-lab` | React M01 preview adapter; formal VPS releases later |
| `ai` | `ai.zxyzx.me` | `personal-ai-web` | static `ops01-config.js` and five Vite page HTML entries |
| subsequent | `*.zxyzx.me` | arbitrary | one config file and one script reference |

### Configuration instructions (manual owner action)
1. Go to https://posthog.com/ and create/connect an account, then create **one project** for all these sites.
2. Copy the **public project token** and region `api_host` (e.g. `https://us.i.posthog.com` or `https://eu.i.posthog.com`).
3. Put the same public token in each site's `public/ops01-config.js`, replacing `TOKEN = ''`; set the actual ingestion host.
4. Build/deploy each site's frontend by its existing release process. Do **not** add a personal API key or service-account secret.
5. Before releasing, provide visitors a privacy notice and visible link to reopen/withdraw consent (`window.OPS01.setConsent(false)`). The included opt-in banner automatically shows at first visit only when configured.
6. If CSP is enabled, allow analytics script origin and provider hosts according to PostHog docs.
7. Check PostHog *Live Events*: opt-in generates `$pageview`; section changes generate `ops01_section_enter`, `ops01_section_leave`; link from personal → AI generates `ops01_outbound_click`. Denial or preview generates no events.
8. Pin the dynamically loaded hosted analytics script to a specific version; do not overwrite shipped release bytes. For upgrade publish `v0.2.0` and migrate sites one at a time.

### Dashboard setup (existing PostHog UI)
Create dashboard "**OPS01 · All Sites**" with:
- Web analytics: daily/weekly unique visitors, sessions, views (breakdown `hostname`)
- Events unique sessions: `ops01_section_enter` by `site_id` and `section_id`
- Funnel: `$pageview` → `ops01_section_enter` / `ops01_cta_click` → `ops01_outbound_click`
- Geolocation: anonymous country/region/city approximation if derived by PostHog (may be wrong under VPN)
- Site-specific filters: `site_id=personal`, `site_id=ai`.
- Dropoff: `ops01_section_enter` to next section + `section_leave` duration; latest observed section only approximates exit (last network send can be lost).

**Important:** funnels require a defined ordered sequence of concrete section IDs. Events from different sites use the same schema but not necessarily the same navigation steps. Define funnels per site.

## Smoke tests and acceptance
```bash
cd ops/analytics
npm ci
npm test
npm run build
node ../../scripts/validate-modules.mjs
```
- Domain gating excludes GitHub Pages previews, localhost and unauthorized hostnames.
- Negative privacy test: when token absent or consent denied, network requests to PostHog must be zero.
- Positive test with project token: capture receipt in PostHog Live Events is needed before claiming working analytics.
- A browser close is not guaranteed to send the last section event. PostHog can report last confirmed event, not certainty.
- Session replay remains disabled in V1 pending explicit privacy review and further user request.

## Change control
OPS01 is independent from M01/M02 content modules. Do not change frozen visual versions, production VPS Nginx or DNS as part of analytics package release. Do not present source-code or preview checks as successful ingestion.
