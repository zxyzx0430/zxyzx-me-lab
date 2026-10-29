import type { CSSProperties, ReactNode } from 'react';
import paperTexture from './assets/master-paper-tile.png';
import inkTexture from './assets/ink-erosion.png';
import originalMountains from './assets/master-mountain.png';
import originalPortrait from './assets/portrait-user-20261028.jpg';
import mountain from './world-assets/mountains.webp';
import alpine from './world-assets/alpine.webp';
import city from './world-assets/city.webp';
import clouds from './world-assets/clouds.webp';
import canyon from './world-assets/canyon.webp';
import observerPhoto from './world-assets/observer-cutout.webp';
import './world-static.css';

export type WorldName = 'within' | 'beyond';
export const getWorldFromQuery = (): WorldName | null => {
  const value = new URLSearchParams(window.location.search).get('world');
  return value === 'within' || value === 'beyond' ? value : null;
};
export const worldLink = (world: WorldName) =>
  window.location.pathname + '?world=' + world;
export const homeLink = () => window.location.pathname;

function Photo({ name, image }: { name: string; image: string }) {
  return <div className={'world-photo world-photo-' + name}
    style={{ backgroundImage: 'url("' + image + '")' }} aria-hidden="true"/>;
}
function Rule({ cx, cy, number, label, line2 }: {
  cx: number; cy: number; number: string; label: string; line2?: string;
}) {
  return <div className="world-archive" style={{ left: cx + '%', top: cy + '%' }}>
    <span className="world-archive-dot"/><b>{number}</b><strong>{label}</strong>
    {line2 && <span className="world-archive-coords">{line2}</span>}
  </div>;
}
function Routes({ world }: { world: WorldName }) {
  return <nav className="world-route-nav" aria-label="双世界页面导航">
    <a href={homeLink()} aria-label="返回 M01 原始海报">← HOME</a>
    <a href={worldLink('within')} aria-current={world === 'within' ? 'page' : undefined}>WITHIN</a>
    <a href={worldLink('beyond')} aria-current={world === 'beyond' ? 'page' : undefined}>BEYOND</a>
  </nav>;
}
function LightBeam() {
  return <div className="world-beam" aria-hidden="true"><span/><span/><span/></div>;
}
function Observer() {
  return <img className="world-observer" src={observerPhoto} alt="" aria-hidden="true" draggable={false}/>;
}
function OrbitalDrawing({ world }: { world: WorldName }) {
  return <svg className="world-engraving" viewBox="0 0 1536 864"
    preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g className="world-axis">
      <path d="M0 152H1536M0 748H1536M299 0V864M1128 0V864"/>
      <path d="M0 450H1536M63 0V864M1398 0V864" strokeDasharray="2 7"/>
    </g>
    {world === 'within' ? <>
      <path className="world-arc" d="M-95 310C144 186 297 203 495 304S887 492 1133 427 1454 260 1600 155"/>
      <path className="world-arc thinner" d="M-60 633C233 649 383 512 615 482S1150 567 1595 294"/>
      <path className="world-arc finer" d="M272 42C294 223 333 386 421 511S677 743 1159 792"/>
      <path className="world-dash" d="M910 0L910 860M1169 0L1169 864M0 589H1536"/>
    </> : <>
      <path className="world-arc" d="M-105 223C174 258 338 370 534 375 844 379 1052 232 1216 274S1431 368 1623 259"/>
      <path className="world-arc thinner" d="M164 744C248 632 399 536 458 586 496 633 333 693 237 766S256 842 421 781C650 689 856 613 1090 689"/>
      <path className="world-arc finer" d="M331 14C490 291 489 483 726 621S1130 687 1560 792"/>
      <path className="world-dash" d="M1056 0V864M0 147H1536M0 532H1536"/>
    </>}
    {[[300,299],[1057,463],[1397,199],[620,629]].map(([x,y],i)=>
      <g key={i} className="world-target">
        <path d={'M'+(x-11)+' '+y+'H'+(x+11)+' M'+x+' '+(y-11)+'V'+(y+11)}/>
        <circle cx={x} cy={y} r="2.1"/>
      </g>)}
  </svg>;
}
function Editorial({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={'world-editorial ' + className}>{children}</div>;
}
export function WorldStatic({ world }: { world: WorldName }) {
  const within = world === 'within';
  const rootStyle = {
    '--world-paper': 'url("' + paperTexture + '")',
    '--world-ink': 'url("' + inkTexture + '")'
  } as CSSProperties;
  return <main className={'m01-world-world m01-world-' + world} style={rootStyle}>
    <section className="world-canvas" aria-label={within ? 'WITHIN 向内寻找中心' : 'BEYOND 向外探寻世界'}>
      <div className="world-ground" aria-hidden="true"/>
      {!within ? <>
        <Photo name="beyond-sky" image={clouds}/>
        <Photo name="beyond-mountain" image={mountain}/>
        <Photo name="beyond-ridges" image={originalMountains}/>
        <Photo name="beyond-horizon" image={alpine}/>
        <Photo name="beyond-city" image={city}/>
        <Photo name="beyond-cityprint" image={city}/>
      </> : <>
        <Photo name="within-rock-left" image={mountain}/>
        <Photo name="within-rock-rear" image={canyon}/>
        <Photo name="within-rock-right" image={canyon}/>
        <Photo name="within-peaks" image={originalMountains}/>
        <Photo name="within-portrait-print" image={originalPortrait}/>
      </>}
      <div className="world-paper-left" aria-hidden="true"/>
      <div className="world-paper-top" aria-hidden="true"/>
      <div className="world-print world-print-one" aria-hidden="true"/>
      <div className="world-print world-print-two" aria-hidden="true"/>
      <div className="world-word-cut" aria-hidden="true">{within ? 'WITHIN.' : 'BEYOND.'}</div>
      {within ? <>
        <LightBeam/>
        <div className="world-caption-paper" aria-hidden="true"/>
        <div className="world-stone world-stone-one" aria-hidden="true"/>
        <div className="world-stone world-stone-two" aria-hidden="true"/>
        <div className="world-stone world-stone-three" aria-hidden="true"/>
        <Observer/>
      </> : <>
        <div className="world-torn-black" aria-hidden="true"/>
        <div className="world-torn-bottom" aria-hidden="true"/>
        <div className="world-torn-white" aria-hidden="true"/>
      </>}
      <OrbitalDrawing world={world}/>
      <Editorial className="world-brand">
        <a href={homeLink()} aria-label="忠心于中心，返回原始首页" className="world-brand-name">忠心于中心</a>
        <span className="world-brand-code">ZXYZX.ME</span>
        <span className="world-brand-rule"/>
        {within ?
          <span className="world-brand-statement">THOUGHT<br/>SELF<br/>ORIGIN<br/>MEANING<br/>···</span> :
          <><span className="world-brand-ideas">AI × IDEAS × REAL WORLD</span>
          <span className="world-brand-cn">在学习中构建，在实践中扩展。</span></>}
      </Editorial>
      {within ? <>
        <Editorial className="world-subtitle world-within-subtitle">
          <span className="world-small-en">THE WORLD WITHIN</span>
          <strong>向内寻找中心。</strong>
        </Editorial>
        <Editorial className="world-quote world-within-quote">
          <span className="world-quote-line"/>
          <p>在复杂与喧嚣之间，<br/>保持内在的秩序，<br/>让思考成为前进的坐标。</p>
          <span>FINDING THE CENTER<br/>IN A COMPLEX WORLD.</span>
        </Editorial>
        <Rule cx={52.7} cy={11} number="01" label="SELF" line2="ORIGIN / 001"/>
        <Rule cx={73.8} cy={52} number="02" label="THINKING" line2="INWARD / 002"/>
        <Rule cx={91.3} cy={82} number="03" label="MEANING" line2="CENTER / 003"/>
        <Editorial className="world-right-maxim">WHAT<br/>I SEE<br/>IS NOT<br/>THE LIMIT<br/>OF THE WORLD.</Editorial>
        <Editorial className="world-top-micro">A<br/>DEEPER<br/>SELF.</Editorial>
      </> : <>
        <Editorial className="world-beyond-tag"><span>THE WORLD<br/>BEYOND.</span><i/> <strong>向外探寻世界。</strong></Editorial>
        <Editorial className="world-quote world-beyond-quote">
          <p>更广阔的世界，<br/>不止于视线所及。</p>
          <span className="world-quote-line"/>
          <span>A WIDER,<br/>BRAVER,<br/>MORE REAL WORLD.</span>
        </Editorial>
        <Rule cx={20} cy={21.8} number="01" label="NATURE" line2="FIELD / 001"/>
        <Rule cx={68.7} cy={53.5} number="02" label="PEOPLE" line2="REALITY / 002"/>
        <Rule cx={91} cy={22.6} number="03" label="IDEAS" line2="RESEARCH / 003"/>
        <Editorial className="world-top-micro">PERSONAL<br/>DIGITAL<br/>SPACE<br/>/ 2026</Editorial>
      </>}
      <Routes world={world}/>
      <div className="world-grain" aria-hidden="true"/>
    </section>
  </main>;
}