const asset = (path) => new URL(path, import.meta.url).href;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
class HomeHeroV3 extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._frame=0;this._paint=this._paint.bind(this);this._handleMotion=this._handleMotion.bind(this)}
  connectedCallback(){
    if(this._live)return;
    this._live=true;
    this.shadowRoot.innerHTML=`
      <link rel="stylesheet" href="${asset("./module.css")}">
      <section class="scene" aria-label="忠心于中心 · 个人首页首屏">
        <div class="ring" aria-hidden="true"></div>
        <div class="ghost" aria-hidden="true">中心</div>
        <figure class="portrait" aria-label="以本人照片制作的电影调色肖像"><img src="${asset('./assets/portrait-user-v3.webp')}" alt="本人艺术化肖像，深色衬衫、眼镜，正面凝视" decoding="async" fetchpriority="high"></figure>
        <div class="portrait-label" aria-hidden="true">PORTRAIT / 忠心于中心 / 2026</div>
        <div class="copy"><span class="line back reveal" aria-hidden="true">向内寻找中心，</span><span class="line front reveal" aria-hidden="true">向外探寻世界。</span><div class="signature reveal" aria-hidden="true">忠于内心的原则，也寻找问题的本质。</div></div>
        <h1 style="position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden">向内寻找中心，向外探寻世界。</h1>
        <div class="bottom"><div><strong>AI × IDEAS × REAL WORLD</strong><span>在学习中构建，在实践中扩展。</span></div><div class="swirl">THINK — EXPLORE — CREATE</div><span class="arrow" aria-hidden="true">↙</span></div>
        <div class="note">SCENE 00 / PERSON & TYPOGRAPHY<br>SCROLL TO SEPARATE THE LAYERS</div>
        <div class="marker" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div class="grain" aria-hidden="true"></div>
      </section>`;
    window.addEventListener('scroll',this._paint,{passive:true});window.addEventListener('resize',this._paint,{passive:true});reduce.addEventListener('change',this._handleMotion);this._paint();
    this.dispatchEvent(new CustomEvent('home-hero:ready',{bubbles:true,composed:true,detail:{version:'v3-rework-v2'}}));
  }
  disconnectedCallback(){window.removeEventListener('scroll',this._paint);window.removeEventListener('resize',this._paint);reduce.removeEventListener('change',this._handleMotion);cancelAnimationFrame(this._frame);this._frame=0;this._live=false;this.shadowRoot.replaceChildren()}
  _handleMotion(){this._paint()}
  _paint(){if(this._frame)return;this._frame=requestAnimationFrame(()=>{this._frame=0;const h=this.getBoundingClientRect(),max=Math.max(1,h.height-innerHeight);const p=reduce.matches?0:Math.max(0,Math.min(1,-h.top/max));this.shadowRoot.querySelector('.scene')?.style.setProperty('--p',p.toFixed(4))})}
}
if(!customElements.get('zxyzx-home-hero-v3')) customElements.define('zxyzx-home-hero-v3',HomeHeroV3);


export default HomeHeroV3;
