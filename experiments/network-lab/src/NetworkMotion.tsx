import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {ParticleField} from "./components/particle-field";
import {ConnectorLines} from "./components/connector-lines";
import {GlowPulse} from "./components/glow-pulse";

type Variant = "A" | "B" | "C";
const COLOR={A:"#92baff",B:"#88ffdb",C:"#b0a6ff"};
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const rand=(i:number,s=1)=>{const v=Math.sin(i*91.3+s*76.71)*43758.5453;return v-Math.floor(v)};
const smooth=(frame:number,start:number,end:number)=>interpolate(frame,[start,end],[0,1],{...clamp,easing:Easing.bezier(.4,0,.2,1)});
type Node={id:string;x:number;y:number;label?:string;cluster?:number};
type Edge={from:string;to:string;shape:"straight"|"curve";bow?:number};
const major:Node[]=[
{id:"diagnose",x:.20,y:.36,label:"诊断"},
{id:"understand",x:.51,y:.23,label:"理解"},
{id:"verify",x:.83,y:.48,label:"验证"},
{id:"memory",x:.50,y:.76,label:"记忆"},
{id:"reuse",x:.17,y:.79,label:"复用"}
];
const labels=["真实问题","知识直觉","主动预测","即时反馈","离开 AI","重新解释","错因分析","复习记录","知识联系","下次调用"];
function makeA():{nodes:Node[];edges:Edge[]}{
 const nodes=[...major];const edges:Edge[]=[];
 for(let i=0;i<24;i++){const h=major[i%5],a=rand(i,31)*Math.PI*2,r=.07+rand(i,42)*.17;nodes.push({id:"sub"+i,x:Math.min(.96,Math.max(.04,h.x+Math.cos(a)*r)),y:Math.min(.94,Math.max(.06,h.y+Math.sin(a)*r)),label:i<10?labels[i]:undefined})}
 for(let i=0;i<24;i++)edges.push({from:major[i%5].id,to:"sub"+i,shape:"curve",bow:i%2?.06:-.06});
 for(let i=0;i<17;i++)edges.push({from:"sub"+i,to:"sub"+((i*7+9)%24),shape:"straight"});
 for(let i=0;i<5;i++)edges.push({from:major[i].id,to:major[(i+1)%5].id,shape:"curve",bow:.04});
 return {nodes,edges};
}
function makeB():{nodes:Node[];edges:Edge[]}{
 const nodes:Node[]=[];const edges:Edge[]=[];
 const centers=[{x:.13,y:.53},{x:.42,y:.27},{x:.72,y:.47},{x:.46,y:.77}];
 centers.forEach((c,k)=>nodes.push({id:"hub"+k,x:c.x,y:c.y,label:["发问","理解","验证","经验"][k]}));
 for(let i=0;i<36;i++){const k=i%4,c=centers[k],a=rand(i,12)*6.283,r=.06+rand(i,20)*.2;nodes.push({id:"n"+i,x:Math.max(.035,Math.min(.95,c.x+Math.cos(a)*r)),y:Math.max(.05,Math.min(.95,c.y+Math.sin(a)*r))});edges.push({from:"hub"+k,to:"n"+i,shape:"curve",bow:(i%3-1)*.08});if(i>8&&i%3===0)edges.push({from:"n"+i,to:"n"+(i-7),shape:"straight"})}
 edges.push({from:"hub0",to:"hub1",shape:"curve",bow:.07},{from:"hub1",to:"hub2",shape:"curve",bow:.04},{from:"hub2",to:"hub3",shape:"curve",bow:.08},{from:"hub3",to:"hub0",shape:"curve",bow:.05});
 return {nodes,edges};
}
function makeC():{nodes:Node[];edges:Edge[]}{
 const nodes:Node[]=[];const edges:Edge[]=[];const c=[{x:.22,y:.3},{x:.7,y:.37},{x:.48,y:.73}];
 for(let i=0;i<67;i++){const cluster=i%3,cc=c[cluster],a=rand(i,17)*Math.PI*2,r=(.04+rand(i,56)*.22);nodes.push({id:"g"+i,cluster,x:Math.max(.03,Math.min(.97,cc.x+Math.cos(a)*r)),y:Math.max(.06,Math.min(.94,cc.y+Math.sin(a)*r))})}
 // Obsidian-style adjacency: connect nearby concepts within each cluster first,
 // then add a sparse set of inter-cluster bridges; avoid radial "spider" rays.
 for(let i=0;i<nodes.length;i++){
   const a=nodes[i];
   const near=nodes.map((b,j)=>({j,d:(a.x-b.x)**2+(a.y-b.y)**2}))
    .filter(v=>v.j!==i && nodes[v.j].cluster===a.cluster && v.j<i)
    .sort((u,v)=>u.d-v.d).slice(0,2);
   near.forEach(v=>edges.push({from:a.id,to:nodes[v.j].id,shape:"straight"}));
 }
 // Cross-topic bridges appear after local relationships have accumulated.
 for(const [a,b] of [[9,22],[15,28],[30,37],[42,50],[7,46],[18,59],[27,62],[38,51],[11,55]]){
   edges.push({from:"g"+a,to:"g"+b,shape:"curve",bow:.035});
 }
 return {nodes,edges};
}
const graphs={A:makeA(),B:makeB(),C:makeC()};
const sceneTitles={A:"从微光到知识网络",B:"让理解传递给下一次学习",C:"一张不断生长的个人知识图谱"};
const sceneKickers={A:"STARS / AWAKEN",B:"SYNAPSE / PULSE",C:"OBSIDIAN / GROWTH"};
const sceneEnds={A:"知识不是孤岛。",B:"反馈形成连接。",C:"旧经验，参与下一次学习。"};
const sceneSub={A:"发现问题 → 追问理解 → 独立验证 → 长期复用",B:"一次学习的结果，成为下一次理解的起点。",C:"从分散的学习记录，到可以重新调用的经验网络。"};
export const NetworkMotion:React.FC<{variant:Variant}>=({variant})=>{
 const frame=useCurrentFrame(),{width,height}=useVideoConfig();
 const graph=graphs[variant],color=COLOR[variant],n=graph.nodes.length;
 const isA=variant==="A",isB=variant==="B",isC=variant==="C";
 const reveal=smooth(frame,7,42),line=smooth(frame,30,105),final=smooth(frame,92,130);
 const textIntro=smooth(frame,3,20),endText=smooth(frame,86,120);
 const graphZoom=isC?interpolate(frame,[0,139],[1.48,.98],clamp):isB?interpolate(frame,[0,139],[1.12,1.04],clamp):interpolate(frame,[0,139],[1.12,.99],clamp);
 const networkTop=205,networkHeight=530;const anchors=graph.nodes.map(d=>({id:d.id,x:d.x,y:d.y}));
 const strokes=graph.edges.map((d,i)=>({...d,color:isA?(i%7===0?"#f3faff":"#6391d8"):isB?(i%6===0?"#b9ffe1":"#367e85"):(i%9===0?"#d6c7ff":"#70759e")}));
 const pt=(node:Node)=>({x:node.x*width,y:node.y*networkHeight});
 const bg=isA?"radial-gradient(ellipse at 50% 48%,#18336b 0%,#0c1635 45%,#040814 100%)":isB?"radial-gradient(ellipse at 56% 50%,#11473e 0%,#0a2229 47%,#050e18 100%)":"radial-gradient(ellipse at 53% 55%,#26214d 0%,#15142d 55%,#080916 100%)";
 return <AbsoluteFill style={{background:bg,color:"#f7f7f3",fontFamily:"'Noto Sans CJK SC','Noto Sans SC',sans-serif",overflow:"hidden"}}>
   <ParticleField backgroundColor="transparent" count={isA?45:28} size={isA?3:2.5} minSize={.5} color={color} angle={isA?18:5} speed={.25} drift={1.4} glow={1.5} seed={isA?3:isB?9:15} intensity={.36}/>
   <div style={{position:"absolute",left:49,top:43,right:49,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:textIntro}}>
     <span style={{fontSize:25,fontWeight:900,letterSpacing:"-.06em"}}>ZXYZX<span style={{fontSize:11,verticalAlign:"top",marginLeft:2}}>®</span></span>
     <span style={{fontFamily:"monospace",fontSize:12,letterSpacing:2,color:"#b5c7e7"}}>MOTION STUDY / {variant}</span>
   </div>
   <div style={{position:"absolute",left:49,right:49,top:118,opacity:textIntro}}>
    <div style={{font:"12px monospace",letterSpacing:2,color:color}}>PERSONAL AI SYSTEM · 01/03</div>
    <div style={{fontSize:isC?36:40,fontWeight:900,letterSpacing:"-.055em",marginTop:17,lineHeight:1.22}}>{sceneTitles[variant]}</div>
   </div>
   <div style={{position:"absolute",top:networkTop,left:0,width,height:networkHeight,transform:"scale("+graphZoom+")",transformOrigin:"center center"}}>
     <div style={{position:"absolute",left:0,top:0,width,height:networkHeight,background:"radial-gradient(circle at 50% 53%,rgba(90,131,255,.16),transparent 55%)",opacity:isC?.3:1}}/>
     <div style={{position:"absolute",left:0,top:0,opacity:line,filter:isB?"drop-shadow(0 0 8px rgba(96,245,212,.28))":"drop-shadow(0 0 7px rgba(142,180,255,.2))"}}>
       <ConnectorLines anchors={anchors} edges={strokes} width={width} height={networkHeight} stroke={color} strokeWidth={isB?1.4:1.08} delayInFrames={isA?23: isB?20:13} durationInFrames={isC?20:24} staggerInFrames={isC?1:isB?1.5:2}/>
     </div>
     {graph.nodes.map((node,i)=>{
      const point=pt(node),appear=smooth(frame,(i*5)%33,((i*5)%33)+19);
      const halo=Math.sin(frame*.13+i*1.1)*.5+.5,majorNode=(isC?i<3:i<(isB?4:5));
      const size=majorNode?isB?14:12:isC?1.5+rand(i,88)*2.1:1.6+rand(i,88)*2.5;
      const pulseBeat=isB&&majorNode?1+Math.max(0,Math.sin(frame*.22-i*1.5))*.8:1;
      const rad=size*pulseBeat*appear;
      return <React.Fragment key={node.id}>
        <div style={{position:"absolute",left:point.x-rad/2,top:point.y-rad/2,width:rad,height:rad,borderRadius:"50%",background:majorNode?"#ffffff":color,opacity:appear*(majorNode?1:.45+.5*halo),boxShadow:"0 0 "+(majorNode?35:12)+"px "+(majorNode?12:1)+"px "+color,willChange:"opacity"}}/>
        {majorNode&&i===1&&isB?<div style={{position:"absolute",left:point.x-28,top:point.y-28,opacity:.8*appear}}><GlowPulse color="#83ffd1" mode="beat" periodInFrames={27} radius={17} halo={1.3} scale={.1}><div style={{width:56,height:56,border:"1px solid #96ffe1",borderRadius:99}}/></GlowPulse></div>:null}
        {!isC&&majorNode?<div style={{position:"absolute",left:point.x,top:point.y-37,transform:"translateX(-50%)",whiteSpace:"nowrap",fontSize:17,fontWeight:800,textShadow:"0 2px 14px #030a15",color:"#ecf7ff",opacity:smooth(frame,65+i*4,95+i*4)}}>{node.label}</div>:null}
       </React.Fragment>
     })}
     {isB&&graph.edges.slice(-4).map((edge,i)=>{const a=graph.nodes.find(d=>d.id===edge.from)!,b=graph.nodes.find(d=>d.id===edge.to)!;const t=((frame*.023+i*.33)%1);const x=(a.x+(b.x-a.x)*t)*width,y=(a.y+(b.y-a.y)*t)*networkHeight;return <div key={"pulse"+i} style={{position:"absolute",left:x-5,top:y-5,width:10,height:10,borderRadius:"50%",background:"#d1fff7",boxShadow:"0 0 20px 5px #71ffd5",opacity:smooth(frame,43,85)}}/>})}
   </div>
   {isC?<div style={{position:"absolute",left:65,right:65,top:675,display:"flex",justifyContent:"space-between",opacity:smooth(frame,85,118)}}>
      {["学习诊断","错误原因","知识关联"].map((v,i)=><span key={v} style={{font:"12px monospace",color:"#c5c6ed",border:"1px solid #9999ce55",borderRadius:20,padding:"8px 10px"}}>{String(i+1).padStart(2,"0")} / {v}</span>)}
   </div>:null}
   <div style={{position:"absolute",left:49,right:49,bottom:45,borderTop:"1px solid "+color+"60",paddingTop:20,display:"flex",flexDirection:"column",gap:10}}>
    <div style={{font:"12px monospace",letterSpacing:2,color:color}}>{sceneKickers[variant]} / {Math.round(frame/1.44)}%</div>
    <div style={{fontSize:44,fontWeight:950,letterSpacing:"-.06em",opacity:endText,transform:"translateY("+(1-endText)*16+"px)"}}>{sceneEnds[variant]}</div>
    <div style={{fontSize:15,color:"#c5d2e6",opacity:final,lineHeight:1.65}}>{sceneSub[variant]}</div>
   </div>
 </AbsoluteFill>;
};
