import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {ParticleField} from "./components/particle-field";
import {ConnectorLines} from "./components/connector-lines";
import {GlowPulse} from "./components/glow-pulse";

const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const progress=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp,easing:Easing.bezier(.42,0,.2,1)});
const seed=(x:number,s=1)=>{const n=Math.sin(x*125.7+s*91.17)*43758.545;return n-Math.floor(n)};
type Point={id:string;x:number;y:number;cluster:number;hub:boolean};
type Line={from:string;to:string;shape:"straight"|"curve";bow?:number;color?:string};
const families=[
 {x:.19,y:.37,name:"发现问题",color:"#76a9ff"},
 {x:.43,y:.19,name:"理解探索",color:"#90e8ff"},
 {x:.77,y:.36,name:"独立验证",color:"#92d8e8"},
 {x:.70,y:.75,name:"长期记忆",color:"#c5adff"},
 {x:.28,y:.77,name:"经验复用",color:"#9ffbd2"},
];
function buildConnectedGraph(){
 const points:Point[]=[];
 const local:Line[]=[],bridges:Line[]=[];
 for(let g=0;g<families.length;g++){
  const c=families[g],start=points.length;
  points.push({id:"hub"+g,x:c.x,y:c.y,cluster:g,hub:true});
  for(let k=0;k<15;k++){
   const angle=(k/15)*Math.PI*2+(seed(k,g+2)-.5)*.75;
   const distance=.055+.16*Math.sqrt((k+1)/16)*(.7+seed(k+20,g+4)*.65);
   const x=Math.max(.035,Math.min(.96,c.x+Math.cos(angle)*distance));
   const y=Math.max(.055,Math.min(.94,c.y+Math.sin(angle)*distance));
   const point:Point={id:"p"+g+"-"+k,x,y,cluster:g,hub:false};
   const candidates=points.slice(start);
   const near=[...candidates].sort((a,b)=>((a.x-x)**2+(a.y-y)**2)-((b.x-x)**2+(b.y-y)**2));
   points.push(point);
   // Each new node attaches to a previously connected node. The cluster is connected by induction.
   local.push({from:near[0].id,to:point.id,shape:"straight",color:c.color});
   if(k>6 && k%3===0 && near[1])local.push({from:near[1].id,to:point.id,shape:"straight",color:c.color});
  }
 }
 // The five connected clusters are joined by an explicit connected spanning chain.
 // Two additional bridges close cycles; all 80 vertices then share one connected component.
 for(const [a,b] of [[0,1],[1,2],[2,3],[3,4],[4,0],[1,3],[0,3]]){
  bridges.push({from:"hub"+a,to:"hub"+b,shape:"curve",bow:(a+b)%2?.035:-.035,color:"#d3e7ff"});
 }
 const adjacency=new Map(points.map(p=>[p.id,[] as string[]]));
 for(const e of [...local,...bridges]){
  adjacency.get(e.from)!.push(e.to);adjacency.get(e.to)!.push(e.from);
 }
 const visited=new Set<string>(),stack=[points[0].id];
 while(stack.length){const id=stack.pop()!;if(visited.has(id))continue;visited.add(id);for(const next of adjacency.get(id)!)if(!visited.has(next))stack.push(next)}
 if(visited.size!==points.length)throw new Error("Graph not connected: "+visited.size+" / "+points.length);
 return {points,local,bridges,connected:visited.size};
}
export const GRAPH_D=buildConnectedGraph();
export const NetworkD:React.FC=()=>{
 const frame=useCurrentFrame(),{width,height}=useVideoConfig();
 const {points,local,bridges,connected}=GRAPH_D;
 const graphY=190,graphHeight=540;
 const anchors=points.map(p=>({id:p.id,x:p.x,y:p.y}));
 const camera=interpolate(frame,[0,70,230,278],[1.14,1.07,.965,.965],clamp);
 const introOpacity=interpolate(frame,[0,14,70,100],[0,1,1,0],clamp);
 const finale=progress(frame,224,264);
 const bridgeReveal=progress(frame,160,222);
 const titleLines=["孤立的知识，","只是碎片。"];
 const bridgePairs=[[0,1],[1,2],[2,3],[3,4],[4,0]];
 const stage=frame<52?"01 / SIGNALS":frame<157?"02 / LOCAL CONNECTIONS":frame<226?"03 / BRIDGES":"04 / ONE CONNECTED SYSTEM";
 const countNodes=frame<65?Math.min(80,Math.max(0,Math.floor((frame-2)*1.31))):80;
 return <AbsoluteFill style={{overflow:"hidden",background:"radial-gradient(ellipse at 52% 46%,#172e54 0%,#0b1933 37%,#070c19 75%,#03040b 100%)",fontFamily:"'Noto Sans CJK SC','Noto Sans SC','PingFang SC',sans-serif",color:"#f6f8ff"}}>
  <ParticleField backgroundColor="transparent" count={75} seed={54} speed={.14} drift={.7} minSize={.6} size={2.9} angle={18} intensity={.37} color="#b7d5ff" glow={1.4}/>
  <div style={{position:"absolute",inset:0,opacity:.28,background:"linear-gradient(90deg,transparent 49.9%,#fff2 50%,transparent 50.1%)"}}/>
  <div style={{position:"absolute",left:44,right:44,top:37,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <span style={{fontWeight:900,fontSize:27,letterSpacing:"-.055em"}}>ZXYZX<sup style={{fontSize:9,verticalAlign:"top"}}>®</sup></span>
    <span style={{font:"11px ui-monospace,monospace",letterSpacing:2,color:"#94accf"}}>PERSONAL AI SYSTEM / MOTION D</span>
  </div>
  <div style={{position:"absolute",left:43,right:43,top:92,display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #8cb8ff55",paddingTop:13}}>
   <span style={{font:"12px ui-monospace,monospace",letterSpacing:1.1,color:"#8fbaff"}}>STARS × NEURONS × KNOWLEDGE</span>
   <span style={{font:"12px ui-monospace,monospace",color:"#a5c0ee"}}>D / 04</span>
  </div>
  <div style={{position:"absolute",left:44,right:44,top:132,opacity:introOpacity,transform:"translateY("+(1-introOpacity)*8+"px)"}}>
   <div style={{fontSize:46,fontWeight:950,lineHeight:1.18,letterSpacing:"-.07em"}}>{titleLines[0]}<br/><span style={{color:"#8eb9ff"}}>{titleLines[1]}</span></div>
  </div>
  <div style={{position:"absolute",top:graphY,left:0,width,height:graphHeight,transform:"scale("+camera+")",transformOrigin:"center center"}}>
   <div style={{position:"absolute",width:650,height:540,top:0,left:30,opacity:progress(frame,0,80)*.8,background:"radial-gradient(ellipse,#17396b33,transparent 68%)"}}/>
   {families.map((c,k)=><div key={"aura"+k} style={{position:"absolute",left:(c.x-.165)*width,top:(c.y-.23)*graphHeight,width:width*.33,height:graphHeight*.46,borderRadius:"50%",background:"radial-gradient(circle,"+c.color+"11,transparent 70%)",opacity:progress(frame,20+k*6,83+k*4)}}/>)}
   <div style={{position:"absolute",inset:0,opacity:progress(frame,58,152)}}>
    <ConnectorLines anchors={anchors} edges={local} width={width} height={graphHeight} strokeWidth={1.08} delayInFrames={62} durationInFrames={18} staggerInFrames={.95}/>
   </div>
   <div style={{position:"absolute",inset:0,opacity:bridgeReveal,filter:"drop-shadow(0 0 8px #8faaff99)"}}>
    <ConnectorLines anchors={anchors} edges={bridges} width={width} height={graphHeight} strokeWidth={2.2} delayInFrames={162} durationInFrames={31} staggerInFrames={6}/>
   </div>
   {points.map((p,i)=>{
    const age=(i%16)*2.5+Math.floor(i/16)*4;
    const appear=progress(frame,7+age,20+age);
    const isHub=p.hub;
    const strength=isHub?1: .55+Math.sin(frame*.13+i*.77)*.23;
    const pulse=Math.sin(frame*.16+i*.82)*.5+.5;
    const x=p.x*width,y=p.y*graphHeight,diameter=(isHub?10:2.8+seed(i,27)*2.1)*Math.max(.03,appear);
    const col=families[p.cluster].color;
    return <React.Fragment key={p.id}>
     <div style={{position:"absolute",left:x-diameter/2,top:y-diameter/2,width:diameter,height:diameter,borderRadius:99,background:isHub?"#fff":col,boxShadow:"0 0 "+(isHub?22:8+5*pulse)+"px "+(isHub?8:2)+"px "+col,opacity:appear*strength}}/>
     {isHub&&frame>45?<div style={{position:"absolute",left:x-20,top:y-20,opacity:progress(frame,54+p.cluster*6,91+p.cluster*6)}}>
      <GlowPulse color={col} radius={13} mode="beat" echo={.38} periodInFrames={44} halo={1.25}>
       <div style={{width:40,height:40,border:"1px solid "+col+"88",borderRadius:99}}/>
      </GlowPulse>
     </div>:null}
     {isHub&&frame>100?<div style={{position:"absolute",left:x,top:y-40,transform:"translateX(-50%)",color:"#edf4ff",fontSize:16,fontWeight:850,textShadow:"0px 1px 12px #040910",whiteSpace:"nowrap",opacity:progress(frame,107+p.cluster*6,136+p.cluster*6)}}>{families[p.cluster].name}</div>:null}
    </React.Fragment>
   })}
   {bridgePairs.map(([a,b],i)=>{
    const from=families[a],to=families[b],t=(frame-172-i*8)/43;
    if(t<0||t>1)return null;
    const x=(from.x+(to.x-from.x)*t)*width,y=(from.y+(to.y-from.y)*t)*graphHeight;
    return <div key={"signal"+i} style={{position:"absolute",left:x-6,top:y-6,width:12,height:12,borderRadius:99,background:"#ffffff",boxShadow:"0 0 22px 7px #7ac7ffbb"}}/>;
   })}
  </div>
  <div style={{position:"absolute",left:44,right:44,bottom:51,borderTop:"1px solid #9ab8ee80",paddingTop:17}}>
   <div style={{display:"flex",justifyContent:"space-between",font:"11px ui-monospace,monospace",letterSpacing:1.2,color:"#8bbaed"}}>
    <span>{stage}</span><span>{frame<220?String(countNodes).padStart(2,"0")+" / 80 NODES":"80 / 80 · CONNECTED"}</span>
   </div>
   <div style={{marginTop:17,minHeight:99}}>
    {frame<225?<div style={{fontSize:33,fontWeight:900,letterSpacing:"-.05em",opacity:progress(frame,10,42)}}>{frame<140?"每一次理解，都留下一个连接。":"一个信号，唤醒整张知识网络。"}</div>:
     <div style={{fontSize:40,fontWeight:950,lineHeight:1.2,letterSpacing:"-.07em",opacity:finale,transform:"translateY("+(1-finale)*13+"px)"}}>
      所有知识，<span style={{color:"#9be4ff"}}>终将相连。</span>
     </div>}
   </div>
   <div style={{color:"#afc2e2",fontSize:15,lineHeight:1.6,opacity:frame>216?progress(frame,230,270):.6}}>
    {frame<225?"从问题诊断，到理解、验证、记忆与复用。":"不只是保存答案，而是让过去的思考参与下一次学习。"}
   </div>
  </div>
 </AbsoluteFill>;
};
