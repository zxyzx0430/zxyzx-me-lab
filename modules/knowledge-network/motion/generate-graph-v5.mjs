import {forceSimulation,forceLink,forceManyBody,forceCollide,forceX,forceY} from "d3-force";
import fs from "node:fs";
let state=20261028;
function rand(){state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}
function pick(list){return list[Math.floor(rand()*list.length)]}
const sizes=[44,33,29,27,25,18], births=[10,94,146,179,223,257];
const anchors=[[-125,8],[130,-110],[216,76],[-90,168],[-235,-120],[65,235]];
const nodes=[],edges=[],roots=[],members=[];
const add=(cluster,kind,parent,birth,manualLabel)=>{const n={id:"n"+nodes.length,cluster,kind,parent,birth,label:manualLabel||"",x:0,y:0};nodes.push(n);if(parent)edges.push({source:parent,target:n.id,kind:"tree"});return n};
for(let c=0;c<sizes.length;c++){
 const cluster=[];
 const launch=c===0?null:pick(members[c===1?0:c-1].filter(n=>n.kind!=="hub"||rand()<.15));
 const hub=add(c,c===0?"origin":"hub",launch?.id||null,births[c],["一个真实问题","新的理解","知识迁移","复习经验","实践验证","新的发现"][c]);
 roots.push(hub);cluster.push(hub);
 for(let j=1;j<sizes[c];j++){
  // Only the first core has many direct satellites. Later branches grow through smaller notes.
  const preferHub=c===0?(j<16||rand()<.18):(j<4||rand()<.055);
  const nearbyParents=cluster.slice(Math.max(0,cluster.length-18));
  const visibleParent=preferHub?hub:pick(nearbyParents);
  const birthday=births[c]+Math.round(Math.pow(j/(sizes[c]-1),.85)*(c===0?90:c===5?65:88));
  const node=add(c,"leaf",visibleParent.id,birthday);
  cluster.push(node);
 }
 members.push(cluster);
}
for(let c=0;c<sizes.length;c++){
 const list=members[c];
 // sparsely connect local neighbors; force link layout will make these plausible contacts.
 for(let j=9;j<list.length;j++){
   if(rand()<.35){
     const other=list[Math.floor(rand()*j)],cur=list[j];
     if(cur.parent!==other.id)edges.push({source:cur.id,target:other.id,kind:"association",birth:cur.birth+15});
   }
 }
}
for (const [a,b] of [[2,3],[8,47],[21,82],[62,111],[121,153],[40,140],[104,152]]){
 if(nodes[a]&&nodes[b])edges.push({source:"n"+a,target:"n"+b,kind:"association",birth:Math.max(nodes[a].birth,nodes[b].birth)+16});
}
const simNodes=nodes.map(n=>({...n,x:anchors[n.cluster][0]+(rand()-.5)*60,y:anchors[n.cluster][1]+(rand()-.5)*60}));
const simLinks=edges.map(e=>({source:e.source,target:e.target,kind:e.kind}));
const graph=forceSimulation(simNodes)
 .randomSource(rand)
 .force("link",forceLink(simLinks).id(d=>d.id).distance(d=>d.kind==="association"?60:d.target.kind==="hub"?98:d.source.kind==="hub"||d.source.kind==="origin"?56:36).strength(d=>d.kind==="association"?.11:.69))
 .force("charge",forceManyBody().strength(d=>d.kind==="origin"?-190:d.kind==="hub"?-125:-37).distanceMax(330))
 .force("collision",forceCollide().radius(d=>d.kind==="origin"?22:d.kind==="hub"?17:6).strength(.86))
 .force("x",forceX(d=>anchors[d.cluster][0]).strength(.007))
 .force("y",forceY(d=>anchors[d.cluster][1]).strength(.007))
 .stop();
for(let k=0;k<620;k++)graph.tick();
const extent={
 minX:Math.min(...simNodes.map(n=>n.x)),maxX:Math.max(...simNodes.map(n=>n.x)),
 minY:Math.min(...simNodes.map(n=>n.y)),maxY:Math.max(...simNodes.map(n=>n.y))
};
const scale=Math.min(600/(extent.maxX-extent.minX),450/(extent.maxY-extent.minY));
const cx=(extent.maxX+extent.minX)/2,cy=(extent.maxY+extent.minY)/2;
const outputNodes=simNodes.map(n=>({id:n.id,cluster:n.cluster,kind:n.kind,parent:n.parent,birth:n.birth,label:n.label,x:360+(n.x-cx)*scale,y:275+(n.y-cy)*scale}));
const outputEdges=simLinks.map((e,i)=>{
 const raw=edges[i];
 const from=e.source.id,to=e.target.id;
 return {from,to,kind:raw.kind,birth:raw.birth??Math.max(nodes.find(n=>n.id===from).birth,nodes.find(n=>n.id===to).birth)+4};
});
const map=new Map(outputNodes.map(n=>[n.id,[]]));
outputEdges.forEach(e=>{map.get(e.from).push(e.to);map.get(e.to).push(e.from)});
const visited=new Set(),queue=[outputNodes[0].id];
while(queue.length){const v=queue.pop();if(visited.has(v))continue;visited.add(v);for(const u of map.get(v))if(!visited.has(u))queue.push(u)}
if(visited.size!==outputNodes.length)throw new Error("Disconnected graph: "+visited.size+" / "+outputNodes.length);
const result={version:5,nodes:outputNodes,edges:outputEdges,connectedComponents:1,counts:{nodes:outputNodes.length,edges:outputEdges.length},extent};
fs.mkdirSync("data",{recursive:true});
fs.writeFileSync("data/graph-v5.json",JSON.stringify(result,null,2));
console.log(JSON.stringify({counts:result.counts,connected:visited.size,bounds:{minX:Math.min(...outputNodes.map(n=>n.x)),maxX:Math.max(...outputNodes.map(n=>n.x)),minY:Math.min(...outputNodes.map(n=>n.y)),maxY:Math.max(...outputNodes.map(n=>n.y))}}));
