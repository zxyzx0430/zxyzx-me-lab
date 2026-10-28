import React from "react";
import {AbsoluteFill,interpolate,useCurrentFrame,Easing} from "remotion";
import {ParticleField} from "./components/particle-field";
import graphJson from "./data/graph-v5.json";
type Node={id:string;cluster:number;kind:string;parent:string|null;birth:number;label:string;x:number;y:number};
type Edge={from:string;to:string;kind:string;birth:number};
const graph=graphJson as {nodes:Node[];edges:Edge[];connectedComponents:number;counts:{nodes:number;edges:number}};
const nodes=graph.nodes;
const nodeMap=new Map(nodes.map(n=>[n.id,n]));
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const ease=(frame:number,a:number,b:number)=>interpolate(frame,[a,b],[0,1],{...clamp,easing:Easing.bezier(.34,0,.2,1)});
function hash(i:number,s=2){const v=Math.sin(i*71.1+s*135.8)*43758.5453;return v-Math.floor(v)}
function trajectory(n:Node,frame:number) {
 const t=ease(frame,n.birth,n.birth+25);
 const source=n.parent?nodeMap.get(n.parent)!:n;
 // Emerging clusters begin close to their parent, rather than arriving at fixed circular anchors.
 const px=source.x+(n.x-source.x)*(.08+.92*t);
 const py=source.y+(n.y-source.y)*(.08+.92*t);
 const sway=ease(frame,n.birth+15,n.birth+38);
 return {x:px+Math.sin(frame*.018+n.x*.07)*.8*sway,y:py+Math.cos(frame*.014+n.y*.05)*.65*sway};
}
const adjacent=new Map(nodes.map(n=>[n.id,[] as string[]]));
graph.edges.forEach(e=>{adjacent.get(e.from)!.push(e.to);adjacent.get(e.to)!.push(e.from)});
function pathBetween(from:string,to:string){
 const queue=[from],prev=new Map<string,string|null>([[from,null]]);
 for(let i=0;i<queue.length;i++){
  const at=queue[i];if(at===to)break;
  for(const next of adjacent.get(at)!)if(!prev.has(next)){prev.set(next,at);queue.push(next)}
 }
 const result=[] as string[];let cur:string|null=to;
 while(cur!==null){result.push(cur);cur=prev.get(cur)??null}
 return result.reverse();
}
const activePath=pathBetween("n175","n15");
const bridgeSegments=activePath.slice(1).map((to,i)=>{const a=nodeMap.get(activePath[i])!,b=nodeMap.get(to)!;return {a,b,length:Math.hypot(b.x-a.x,b.y-a.y)}});
const distanceTotal=bridgeSegments.reduce((s,e)=>s+e.length,0);
const timelineFrames=408; // 17 seconds @ 24 fps
export const NetworkObsidianV5:React.FC=()=>{
 const frame=useCurrentFrame();
 const camera=interpolate(frame,[0,85,240,385],[1.56,1.32,1.08,1.01],clamp);
 const driftX=interpolate(frame,[0,150,350],[12,1,-6],clamp);
 const driftY=interpolate(frame,[0,150,350],[30,7,-7],clamp);
 const label=(frame<88)?"一个问题，成为起点。":frame<170?"新的知识，从关联处生长。":frame<290?"每一次积累，都让图谱变得丰富。":"过去的思考，参与下一次学习。";
 const alive=nodes.filter(n=>frame>=n.birth-1).length;
 const done=ease(frame,300,344),pulseTime=ease(frame,328,385);
 // Pulse travels along the actual shortest path between two separated leaf nodes.
 let remaining=pulseTime*distanceTotal;
 let signal={x:0,y:0};
 for(const e of bridgeSegments){
  if(remaining<=e.length){const t=Math.max(0,Math.min(1,remaining/e.length));signal={x:e.a.x+(e.b.x-e.a.x)*t,y:e.a.y+(e.b.y-e.a.y)*t};break}
  remaining-=e.length;signal={x:e.b.x,y:e.b.y};
 }
 const intro=ease(frame,3,19);
 return <AbsoluteFill style={{background:"radial-gradient(ellipse at 46% 52%,#111c38 0%,#090f21 48%,#03070f 100%)",color:"#eef3ff",fontFamily:"'Noto Sans CJK SC','Noto Sans SC','PingFang SC',system-ui,sans-serif",overflow:"hidden"}}>
  <ParticleField backgroundColor="transparent" color="#b5d5ff" count={55} angle={2} speed={.16} glow={1.4} intensity={.29} size={2.3} minSize={.45} drift={.8} seed={29}/>
  <div style={{position:"absolute",top:40,left:44,right:44,display:"flex",alignItems:"center",justifyContent:"space-between",opacity:intro}}>
   <div style={{fontSize:26,fontWeight:920,letterSpacing:"-.08em"}}>ZXYZX<sup style={{fontSize:9,verticalAlign:"top"}}>®</sup></div>
   <div style={{font:"10px ui-monospace,monospace",letterSpacing:2,color:"#94a4c8"}}>MOTION STUDY / V5</div>
  </div>
  <div style={{position:"absolute",top:103,left:44,right:44,opacity:intro}}>
    <div style={{font:"11px ui-monospace,monospace",letterSpacing:1.5,color:"#819dd1"}}>PERSONAL AI SYSTEM / KNOWLEDGE GRAPH</div>
    <div style={{fontWeight:850,fontSize:39,letterSpacing:"-.06em",marginTop:17}}>从一个点，<span style={{color:"#9ecaff"}}>生长成一张网。</span></div>
  </div>
  <div style={{position:"absolute",top:194,left:0,width:720,height:535,overflow:"hidden"}}>
   <svg width="720" height="535" viewBox="0 0 720 535" aria-label="知识图谱动画：一个核心节点逐渐生长为不规则的多簇连通网络">
    <defs>
      <radialGradient id="star-glow"><stop offset="0%" stopColor="#e0f1ff" stopOpacity=".6"/><stop offset="35%" stopColor="#92b8ff" stopOpacity=".22"/><stop offset="100%" stopColor="#608cda" stopOpacity="0"/></radialGradient>
      <radialGradient id="pulse-glow"><stop offset="0%" stopColor="#ffffff" stopOpacity=".95"/><stop offset="20%" stopColor="#9fdfff" stopOpacity=".45"/><stop offset="100%" stopColor="#9fdfff" stopOpacity="0"/></radialGradient>
    </defs>
    <g transform={"translate("+driftX+" "+driftY+") translate(360 270) scale("+camera+") translate(-360 -270)"}>
     {/* Draw fine, natural Obsidian-style links. The tree edges alone already connect every point. */}
     {graph.edges.map((edge,i)=>{
      const from=nodeMap.get(edge.from)!,to=nodeMap.get(edge.to)!;
      const p=trajectory(from,frame),q=trajectory(to,frame);
      const t=ease(frame,edge.birth,edge.birth+22);
      if(t<=0)return null;
      const target={x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t};
      const lineColor=edge.kind==="tree"?"#87a9da":"#a5a6cf";
      const alpha=edge.kind==="tree"?.32:.15;
      return <line key={i} x1={p.x} y1={p.y} x2={target.x} y2={target.y} stroke={lineColor} strokeWidth={edge.kind==="tree"?.85:.57} opacity={alpha*Math.min(1,t*2)}/>;
     })}
     {/* Core glow is significant; secondary hubs remain small, unlike the old symmetric five-node design. */}
     {nodes.map((n,i)=>{
      const reveal=ease(frame,n.birth-3,n.birth+18);
      if(reveal<=0)return null;
      const p=trajectory(n,frame);
      const isOrigin=n.kind==="origin";
      const isHub=n.kind==="hub";
      const r=isOrigin?8.1:isHub?2.85:(i%17===0?2.35:1.15+hash(i,9)*1.05);
      const twinkle=.82+.18*Math.sin(frame*(.07+hash(i,32)*.08)+i*1.71);
      const glimmer=frame>n.birth&&frame<n.birth+14?1.8:1;
      const op=Math.min(1,reveal)*twinkle;
      return <g key={n.id}>
       {(isOrigin||isHub||i%13===0)&&<circle cx={p.x} cy={p.y} r={isOrigin?42:isHub?21:10} fill="url(#star-glow)" opacity={op*(isOrigin?.51:.09)}/>}
       <circle cx={p.x} cy={p.y} r={r*glimmer} fill={isOrigin?"#f1f8ff":isHub?"#d8eaff":i%9===0?"#afc9ff":"#9ab6e4"} opacity={op}/>
       {isOrigin&&frame>20?<circle cx={p.x} cy={p.y} r={15+Math.sin(frame*.12)*1.4} stroke="#99baff" fill="none" opacity={.17*reveal} strokeWidth=".7"/>:null}
      </g>;
     })}
     {/* At the end a real multi-hop path lights up, demonstrating retrieval rather than decorative electricity. */}
     {frame>321&&bridgeSegments.map((s,i)=>{
      const earlier=bridgeSegments.slice(0,i).reduce((acc,x)=>acc+x.length,0);
      const fraction=Math.max(0,Math.min(1,(pulseTime*distanceTotal-earlier)/s.length));
      if(fraction<=0)return null;
      return <line key={"active"+i} x1={s.a.x} y1={s.a.y} x2={s.a.x+(s.b.x-s.a.x)*fraction} y2={s.a.y+(s.b.y-s.a.y)*fraction} stroke="#c8eaff" strokeWidth={1.18} opacity={.63}/>;
     })}
     {frame>329?<g opacity={ease(frame,331,339)*(1-ease(frame,393,405))}>
      <circle cx={signal.x} cy={signal.y} r="17" fill="url(#pulse-glow)"/>
      <circle cx={signal.x} cy={signal.y} r="3.1" fill="#ffffff"/>
     </g>:null}
    </g>
   </svg>
  </div>
  <div style={{position:"absolute",left:44,right:44,top:728,display:"flex",justifyContent:"space-between",borderTop:"1px solid #6783ad66",paddingTop:15,font:"10px ui-monospace,monospace",letterSpacing:"1.3px",color:"#a9bbd8"}}>
   <span>{frame<90?"01 / FIRST IDEA":frame<210?"02 / GROWTH":frame<309?"03 / RELATED IDEAS":"04 / RECALL"}</span>
   <span>{alive} / {nodes.length} NODES</span>
  </div>
  <div style={{position:"absolute",left:44,right:44,bottom:31}}>
    <div style={{fontSize:29,fontWeight:900,letterSpacing:"-.06em",lineHeight:1.5,minHeight:60,opacity:ease(frame,8,31)}}>{label}</div>
    <div style={{fontSize:13,color:"#96a8cb",lineHeight:1.9,opacity:ease(frame,18,49)}}>
      {frame<300?"不规则生长 · 细微闪烁 · 自然关联":frame<330?"所有节点经由真实连接路径相互可达": "被唤醒的不是一个答案，而是一条可以复用的学习经验。"}
    </div>
    <div style={{marginTop:15,width:"100%",height:2,background:"#ffffff1a"}}>
      <div style={{height:"100%",width:Math.min(100,(frame/timelineFrames)*100)+"%",background:"#81b3ff"}}/>
    </div>
  </div>
 </AbsoluteFill>;
};
