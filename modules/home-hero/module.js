/**
 * M01 / HOME HERO · independent interactive Web Component
 * Public API: <zxyzx-home-hero></zxyzx-home-hero>
 * Events: home-hero:ready / home-hero:enter / home-hero:exit / home-hero:motion
 * Methods: replay(), setMotion(boolean), motionEnabled
 * No dependency on site shell, other modules, third-party JS, or home page globals.
 */
const getAsset = (name) => new URL(name, import.meta.url).href;
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

export class ZxyzxHomeHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this._enabled = !motionQuery.matches;
    this._active = false;
    this._progress = 0;
    this._pointerX = 0;
    this._pointerY = 0;
    this._raf = 0;
    this._lastRegion = null;
    this._scroll = this._scroll.bind(this);
    this._pointer = this._pointer.bind(this);
    this._resetPointer = this._resetPointer.bind(this);
    this._onReducedMotion = this._onReducedMotion.bind(this);
  }
  connectedCallback() {
    if (this._active) return;
    this._active = true;
    const c = this.shadowRoot;
    c.innerHTML = [
      '<link rel="stylesheet" href="', getAsset("module.css"), '">',
      '<section class="hero', this._enabled ? '' : ' still', '" aria-label="忠心于中心：首页电影式开场">',
      '<div class="surface" aria-hidden="true">',
        '<span class="surface-grid"></span>',
        '<span class="halo halo-a"></span><span class="halo halo-b"></span>',
        '<span class="orbit orbit-a"></span><span class="orbit orbit-b"></span>',
        '<span class="film-grain"></span>',
      '</div>',
      '<div class="frame frame-top" aria-hidden="true"><i></i><span>PERSONAL EXPLORATION / 001</span><i></i></div>',
      '<div class="chapter chapter-inner" aria-hidden="true"><span class="serial">01 / INNER</span>',
        '<span class="line line-inner">向内</span>',
        '<span class="line line-core">寻找中心</span>',
      '</div>',
      '<div class="portrait-depth" aria-hidden="true">',
        '<div class="portrait-backdrop"></div>',
        '<img class="portrait" src="', getAsset("assets/portrait-cinematic-enhanced.webp"), '"',
        ' alt="" decoding="async" fetchpriority="high">',
      '</div>',
      '<div class="chapter chapter-outer" aria-hidden="true"><span class="serial">02 / OUTER</span>',
        '<span class="line line-outer">向外</span>',
        '<span class="line line-world">探寻世界</span>',
      '</div>',
      '<div class="headline-readable" aria-hidden="false">',
        '<h1><span>向内寻找中心，</span><span>向外探寻世界。</span></h1>',
      '</div>',
      '<div class="micro micro-side" aria-hidden="true"><span>SELF / WORLD</span><span>THINK / BUILD / EXPLORE</span></div>',
      '<div class="caption-left" aria-hidden="true"><span>忠于内在原则</span><span>探索问题本质</span></div>',
      '<div class="hero-foot">',
        '<span class="identity">ZXYZX.ME <em>—</em> THE PERSON BEHIND THE SYSTEM</span>',
        '<a class="scroll-link" href="#m01-exit" part="scroll-link">SCROLL TO EXPLORE <span class="scroll-arrow" aria-hidden="true">↓</span></a>',
      '</div>',
      '</section>'
    ].join("");
    this._hero = c.querySelector(".hero");
    this._portrait = c.querySelector(".portrait");
    this._scrollLink = c.querySelector(".scroll-link");
    this._portrait.addEventListener("error", this._onImageError = () => this._emit("error", {kind:"portrait"}));
    this._scrollLink.addEventListener("click", this._onExplore = (event) => {
      // In a standalone module, send intent; the outer composition owns destinations.
      this._emit("explore");
      const dest = document.getElementById("m01-exit");
      if (!dest) { event.preventDefault(); }
    });
    this.addEventListener("pointermove", this._pointer, {passive:true});
    this.addEventListener("pointerleave", this._resetPointer, {passive:true});
    window.addEventListener("scroll", this._scroll, {passive:true});
    window.addEventListener("resize", this._scroll, {passive:true});
    motionQuery.addEventListener("change", this._onReducedMotion);
    this._scroll();
    if (!this._enabled) this._hero.classList.add("still");
    this._emit("ready", {motionEnabled:this._enabled});
  }
  disconnectedCallback() {
    if (!this._active) return;
    this._active = false;
    window.removeEventListener("scroll", this._scroll);
    window.removeEventListener("resize", this._scroll);
    this.removeEventListener("pointermove", this._pointer);
    this.removeEventListener("pointerleave", this._resetPointer);
    motionQuery.removeEventListener("change", this._onReducedMotion);
    this._portrait?.removeEventListener("error", this._onImageError);
    this._scrollLink?.removeEventListener("click", this._onExplore);
    cancelAnimationFrame(this._raf);
    this._raf = 0;
    this.shadowRoot.replaceChildren();
  }
  get motionEnabled() { return this._enabled; }
  setMotion(allow) {
    this._enabled = Boolean(allow) && !motionQuery.matches;
    this._hero?.classList.toggle("still", !this._enabled);
    if (!this._enabled) this._resetPointer();
    this._emit("motion", {motionEnabled:this._enabled});
  }
  replay() {
    if (!this._hero) return;
    this._hero.classList.add("replay-reset");
    void this._hero.offsetWidth;
    this._hero.classList.remove("replay-reset");
    this._emit("replay");
  }
  _onReducedMotion() { this.setMotion(!motionQuery.matches); }
  _pointer(event) {
    if (!this._enabled || !this._hero) return;
    const rect = this._hero.getBoundingClientRect();
    this._pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    this._pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    this._queue();
  }
  _resetPointer() {
    this._pointerX = 0;
    this._pointerY = 0;
    this._queue();
  }
  _scroll() {
    if (!this._hero) return;
    const rect = this.getBoundingClientRect();
    const height = Math.max(rect.height, 1);
    const p = Math.max(0, Math.min(1, -rect.top / (height * 0.82)));
    this._progress = p;
    const state = p >= .75 ? "exit" : "enter";
    if (state !== this._lastRegion) {
      this._lastRegion = state;
      this._emit(state, {progress:p});
    }
    this._queue();
  }
  _queue() {
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      if (!this._hero) return;
      const h = this._hero;
      h.style.setProperty("--mx", this._enabled ? this._pointerX.toFixed(3) : "0");
      h.style.setProperty("--my", this._enabled ? this._pointerY.toFixed(3) : "0");
      h.style.setProperty("--progress", this._enabled ? this._progress.toFixed(3) : "0");
    });
  }
  _emit(name, detail={}) {
    this.dispatchEvent(new CustomEvent("home-hero:"+name, {
      bubbles:true, composed:true, detail:{moduleId:"home-hero",...detail}
    }));
  }
}
if (!customElements.get("zxyzx-home-hero")) {
  customElements.define("zxyzx-home-hero", ZxyzxHomeHero);
}
export default ZxyzxHomeHero;
