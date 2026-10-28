/**
 * ZXYZX Knowledge Network V5 — standalone Web Component.
 * Public: <zxyzx-knowledge-network autoplay loop></zxyzx-knowledge-network>
 * Methods: play(), pause(), seek(seconds), currentTime, duration.
 * Events: knowledge-network:ready/play/pause/seek/error (bubbles, composed).
 * Approved artwork is immutable. Visual changes require a new version.
 */
const MODULE_ID = "knowledge-network";
const base = new URL("./", import.meta.url);
const asset = (path) => new URL(path, base).href;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const renderTime = (seconds) => {
  const value = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return String(Math.floor(value / 60)).padStart(2, "0") + ":" +
    String(value % 60).padStart(2, "0");
};

export class KnowledgeNetwork extends HTMLElement {
  static get observedAttributes() { return ["autoplay", "loop"]; }

  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.onVisibility = () => { if (document.hidden) this.pause(); };
  }

  connectedCallback() {
    if (this.video) return;
    this.shadowRoot.innerHTML = [
      '<link rel="stylesheet" href="' + asset("module.css") + '">',
      '<section class="network" aria-label="Personal AI System 知识网络动画">',
      '<div class="frame">',
      '<video muted playsinline preload="metadata" aria-label="从一个核心知识点自然生长为完整的知识网络"></video>',
      '</div>',
      '<div class="controls" role="group" aria-label="动画播放控制">',
      '<button type="button" class="toggle" aria-label="播放知识网络动画">PLAY ▶</button>',
      '<label class="slider-label"><span class="sr-only">动画进度</span>',
      '<input type="range" min="0" max="17.045" step="0.05" value="0" aria-label="知识网络动画进度"></label>',
      '<output class="counter" aria-live="off">00:00 / 00:17</output>',
      '</div>',
      '<div class="foot"><span>OBSIDIAN STYLE · ORGANIC GROWTH</span><span>17 SEC · REMOTION</span></div>',
      '</section>'
    ].join("");

    const $ = (s) => this.shadowRoot.querySelector(s);
    this.video = $("video");
    this.button = $(".toggle");
    this.scrub = $('input[type="range"]');
    this.counter = $(".counter");
    this.video.poster = asset("assets/final.jpg");
    this.video.src = asset("assets/obsidian-growth-v5.mp4");
    this.video.loop = this.hasAttribute("loop");
    this.video.muted = true;

    this._sync = () => {
      const t = this.currentTime;
      this.scrub.value = String(t);
      this.scrub.max = String(this.duration || 17.045);
      this.counter.textContent = renderTime(t) + " / " + renderTime(this.duration || 17);
      this.button.textContent = this.video.paused ? "PLAY ▶" : "PAUSE ❚❚";
      this.button.setAttribute("aria-label", this.video.paused ? "播放知识网络动画" : "暂停知识网络动画");
    };
    this._onTime = () => this._sync();
    this._onPlay = () => { this._sync(); this._emit("play"); };
    this._onPause = () => { this._sync(); this._emit("pause"); };
    this._onReady = () => { this._sync(); this._emit("ready", {duration: this.duration}); };
    this._onError = () => this._emit("error", {mediaError: this.video.error?.code || null});
    this._onButton = () => { if (this.video.paused) this.play(); else this.pause(); };
    this._onInput = () => this.seek(Number(this.scrub.value));

    this.video.addEventListener("timeupdate", this._onTime);
    this.video.addEventListener("play", this._onPlay);
    this.video.addEventListener("pause", this._onPause);
    this.video.addEventListener("loadedmetadata", this._onReady);
    this.video.addEventListener("error", this._onError);
    this.button.addEventListener("click", this._onButton);
    this.scrub.addEventListener("input", this._onInput);
    document.addEventListener("visibilitychange", this.onVisibility);
    this._sync();

    if (this.hasAttribute("autoplay") && !reduceMotion()) this.play();
  }

  disconnectedCallback() {
    if (!this.video) return;
    this.pause();
    this.video.removeEventListener("timeupdate", this._onTime);
    this.video.removeEventListener("play", this._onPlay);
    this.video.removeEventListener("pause", this._onPause);
    this.video.removeEventListener("loadedmetadata", this._onReady);
    this.video.removeEventListener("error", this._onError);
    this.button.removeEventListener("click", this._onButton);
    this.scrub.removeEventListener("input", this._onInput);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.video.removeAttribute("src");
    this.video.load();
    this.video = null;
    this.shadowRoot.replaceChildren();
  }

  attributeChangedCallback(name) {
    if (!this.video) return;
    if (name === "loop") this.video.loop = this.hasAttribute("loop");
    if (name === "autoplay" && this.hasAttribute("autoplay") && !reduceMotion()) this.play();
  }

  get currentTime() { return this.video?.currentTime ?? 0; }
  get duration() { return Number.isFinite(this.video?.duration) ? this.video.duration : 0; }
  play() { return this.video?.play()?.catch(() => {}); }
  pause() { this.video?.pause(); }
  seek(time) {
    if (!this.video || !Number.isFinite(time)) return Promise.resolve();
    const video = this.video;
    const max = this.duration || 17.045;
    const target = Math.max(0, Math.min(max, time));
    if (Math.abs(video.currentTime - target) < 0.04 && !video.seeking) {
      this._sync();
      this._emit("seek", {time: this.currentTime});
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const finish = () => {
        video.removeEventListener("seeked", finish);
        this._sync();
        this._emit("seek", {time: this.currentTime});
        resolve();
      };
      video.addEventListener("seeked", finish, {once: true});
      video.currentTime = target;
    });
  }
  _emit(action, extras = {}) {
    this.dispatchEvent(new CustomEvent("knowledge-network:" + action, {
      bubbles: true, composed: true,
      detail: {moduleId: MODULE_ID, ...extras}
    }));
  }
}
if (!customElements.get("zxyzx-knowledge-network")) {
  customElements.define("zxyzx-knowledge-network", KnowledgeNetwork);
}
export default KnowledgeNetwork;
