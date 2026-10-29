import posthog from 'posthog-js';
import { EVENT, cleanSlug, cleanPath, isAllowedHost, publicProps, safeProps } from './core.js';

// Single read-only global interface. No raw IP, URL search terms, emails or typed input.
const CONSENT_KEY = 'zxyzx_ops01_analytics_consent_v1';
let active = false;
let started = false;
let config = null;
let section = null;
let sectionStart = 0;
let sequence = 0;
let observer = null;
const now = () => performance.now();
const host = () => window.location.hostname.toLowerCase();
const safeUrl = () => window.location.origin + cleanPath(window.location.pathname);
const getConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const saveConsent = (v) => { try { localStorage.setItem(CONSENT_KEY, v); } catch {} };
const base = () => publicProps(config, window);
function record(name, values) {
  if (!active || !started) return false;
  posthog.capture(name, {
    ...base(), ...safeProps(values),
    $current_url: safeUrl(), $pathname: cleanPath(window.location.pathname)
  });
  return true;
}
function setSection(next) {
  const id = cleanSlug(next);
  if (id === section) return;
  if (section && active) record(EVENT.SECTION_LEAVE, {
    section_id: section, duration_ms: now() - sectionStart, sequence
  });
  section = id;
  sectionStart = now();
  sequence++;
  if (active) record(EVENT.SECTION_ENTER, { section_id: id, sequence });
}
function onVisibility() {
  if (document.visibilityState === 'hidden' && section && active) {
    record(EVENT.SECTION_LEAVE, { section_id: section, duration_ms: now() - sectionStart, sequence });
    sectionStart = now();
  }
}
function observeSections() {
  const nodes = [...document.querySelectorAll('[data-ops-section], main section[id], main > section')].slice(0, 60);
  if (!nodes.length || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting && e.intersectionRatio >= 0.42);
    visible.sort((a,b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) {
      const el = visible[0].target;
      setSection(el.getAttribute('data-ops-section') || el.id || 'section');
    }
  }, { threshold: [0.42, 0.6, 0.9] });
  nodes.forEach(el => observer.observe(el));
}
function onClick(e) {
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return;
  const annotated = target.closest('[data-ops-event]');
  if (annotated) {
    const eventName = annotated.getAttribute('data-ops-event');
    if (eventName === 'cta_click') {
      record(EVENT.CTA_CLICK, { target_id: annotated.getAttribute('data-ops-target') || annotated.id || 'cta' });
    }
  }
  const anchor = target.closest('a[href]');
  if (anchor) {
    try {
      const link = new URL(anchor.href, window.location.href);
      if (!['http:', 'https:'].includes(link.protocol)) return;
      if (link.hostname !== host() && /(^|\\.)zxyzx\\.me$/.test(link.hostname)) {
        record(EVENT.OUTBOUND_CLICK, { destination_site: link.hostname.replace(/\\./g,'-') });
      }
    } catch {}
  }
}
function showConsentUI() {
  if (getConsent() || document.getElementById('ops01-consent')) return;
  const root = document.createElement('aside');
  root.id = 'ops01-consent';
  root.setAttribute('aria-label', '匿名网站分析设置');
  root.style.cssText = 'position:fixed;bottom:14px;left:14px;z-index:2147483640;background:#171717;color:#fff;border-radius:10px;padding:13px 15px;max-width:min(360px,calc(100vw - 28px));font:13px/1.6 system-ui,sans-serif;box-shadow:0 4px 24px #0003;';
  const description = document.createElement('p');
  description.textContent = '是否允许匿名访问统计？用于改进网站章节与交互体验。不录制屏幕、不收集输入内容。';
  description.style.margin = '0 0 10px';
  root.appendChild(description);
  for (const [label, answer] of [['同意', 'granted'], ['拒绝', 'denied']]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.type = 'button';
    button.style.cssText = 'cursor:pointer;margin-right:10px;padding:5px 12px;border-radius:5px;border:1px solid #aaa;background:' + (answer === 'granted' ? '#f4f4f4;color:#111' : '#333;color:#fff');
    button.addEventListener('click', () => {
      root.remove();
      api.setConsent(answer === 'granted');
    });
    root.appendChild(button);
  }
  document.body.appendChild(root);
}
const api = Object.freeze({
  init(options) {
    if (started) return true;
    const conf = options || {};
    config = {
      siteId: conf.siteId,
      token: conf.token,
      apiHost: conf.apiHost || 'https://us.i.posthog.com',
      allowedHosts: conf.allowedHosts,
      environment: conf.environment || 'production'
    };
    if (!conf.token || !conf.siteId || !isAllowedHost(host(), config.environment, config.allowedHosts)) return false;
    started = true;
    posthog.init(config.token, {
      api_host: config.apiHost,
      defaults: '2026-08-30',
      capture_pageview: false,
      capture_pageleave: false,
      advanced_disable_decide: true,
      advanced_disable_feature_flags: true,
      save_referrer: false,
      save_campaign_params: false,
      mask_all_text: true,
      mask_all_element_attributes: true,
      autocapture: false,
      disable_session_recording: true,
      disable_surveys: true,
      person_profiles: 'identified_only',
      cross_subdomain_cookie: true,
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      sanitize_properties(props) {
        // Filter accidental URL query strings and default referrer fields.
        const o = {...props};
        o.$current_url = safeUrl();
        o.$pathname = cleanPath(window.location.pathname);
        delete o.$referrer;
        delete o.$initial_referrer;
        delete o.$referring_domain;
        return o;
      }
    });
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('click', onClick, { passive: true });
    observeSections();
    if (getConsent() === 'granted') {
      api.setConsent(true);
    } else if (!getConsent()) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showConsentUI, {once:true});
      else showConsentUI();
    }
    return true;
  },
  setConsent(granted) {
    saveConsent(granted ? 'granted' : 'denied');
    if (!started) return false;
    active = Boolean(granted);
    if (active) {
      posthog.opt_in_capturing({ captureEventName: false });
      record(EVENT.PAGE_VIEW, {});
      if (section) record(EVENT.SECTION_ENTER, { section_id: section, sequence });
    } else {
      posthog.opt_out_capturing();
    }
    return true;
  },
  track(eventName, properties = {}) {
    const allowed = ['ops01_cta_click', 'ops01_custom_action'];
    if (!allowed.includes(eventName)) return false;
    return record(eventName, properties);
  },
  sectionEnter(id) { if (started) setSection(id); },
  status() { return { configured: started, enabled: active, site_id: config?.siteId || null, current_section: section }; },
  dispose() {
    observer?.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('click', onClick);
  }
});
window.OPS01 = api;
export { api as OPS01 };
