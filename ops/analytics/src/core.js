export const EVENT = Object.freeze({
  PAGE_VIEW: '$pageview',
  SECTION_ENTER: 'ops01_section_enter',
  SECTION_LEAVE: 'ops01_section_leave',
  CTA_CLICK: 'ops01_cta_click',
  OUTBOUND_CLICK: 'ops01_outbound_click'
});
export function cleanSlug(value) {
  const v = String(value ?? '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  return v.slice(0, 64) || 'unknown';
}
export function cleanPath(path) {
  const v = String(path || '/').split(/[?#]/)[0];
  return v.startsWith('/') ? v.slice(0, 180) : '/';
}
export function isAllowedHost(hostname, environment, allowedHosts) {
  if (environment !== 'production') return false;
  return Array.isArray(allowedHosts) && allowedHosts.includes(String(hostname).toLowerCase());
}
export function publicProps(config, win) {
  return {
    site_id: cleanSlug(config.siteId),
    hostname: String(win.location.hostname).toLowerCase(),
    pathname: cleanPath(win.location.pathname),
    environment: 'production',
    schema_version: 'ops01-v1'
  };
}
export function safeProps(props = {}) {
  const out = {};
  for (const k of ['section_id', 'target_id', 'destination_site']) {
    if (typeof props[k] === 'string') out[k] = cleanSlug(props[k]);
  }
  if (typeof props.duration_ms === 'number' && Number.isFinite(props.duration_ms)) {
    out.duration_ms = Math.max(0, Math.min(Math.round(props.duration_ms), 3_600_000));
  }
  if (typeof props.sequence === 'number' && Number.isFinite(props.sequence)) {
    out.sequence = Math.max(0, Math.min(Math.round(props.sequence), 1000));
  }
  return out;
}
