import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repo=path.resolve(root,"../..");
const read=(p)=>fs.readFileSync(path.join(root,p));
const sha=(b)=>crypto.createHash("sha256").update(b).digest("hex");
const manifest=JSON.parse(read("module.json"));

test("approved animation is byte-identical to historical V5",()=>{
  const bundled=read("assets/obsidian-growth-v5.mp4");
  const approved=fs.readFileSync(path.join(repo,"experiments/network-v5/assets/obsidian-growth-v5.mp4"));
  assert.equal(sha(bundled),sha(approved));
  assert.equal(sha(bundled),manifest.assets.videoSha256);
});

test("approved Remotion motion source and graph data remain identical",()=>{
  for (const [own,original] of [
    ["motion/NetworkObsidianV5.tsx","experiments/network-lab/src/NetworkObsidianV5.tsx"],
    ["motion/data/graph-v5.json","experiments/network-lab/src/data/graph-v5.json"]
  ]) {
    assert.equal(sha(read(own)),sha(fs.readFileSync(path.join(repo,original))));
  }
});

test("all graph nodes are connected via graph edges",()=>{
  const graph=JSON.parse(read("motion/data/graph-v5.json"));
  assert.equal(graph.nodes.length,176);
  assert.equal(graph.edges.length,228);
  const adj=new Map(graph.nodes.map(n=>[n.id,new Set()]));
  for(const e of graph.edges){
    assert.ok(adj.has(e.from)&&adj.has(e.to),"Invalid edge endpoints");
    adj.get(e.from).add(e.to); adj.get(e.to).add(e.from);
  }
  const visited=new Set(),pending=[graph.nodes[0].id];
  while(pending.length){
    const n=pending.pop(); if(visited.has(n))continue; visited.add(n);
    for(const next of adj.get(n))if(!visited.has(next))pending.push(next);
  }
  assert.equal(visited.size,graph.nodes.length);
});

test("public web component has no dependency on V4 homepage or old experiments",()=>{
  const src=read("module.js").toString();
  assert.match(src,/customElements\.define\("zxyzx-knowledge-network"/);
  assert.match(src,/attachShadow/);
  assert.match(src,/import\.meta\.url/);
  assert.doesNotMatch(src,/experiments\/network-v5|document\.body\.style|window\.onscroll/);
  assert.equal(manifest.runtimeDependencies.length,0);
});

test("module preview references only its own public entry",()=>{
  const doc=read("index.html").toString();
  assert.match(doc,/src="\.\/module\.js"/);
  assert.match(doc,/<zxyzx-knowledge-network/);
  assert.doesNotMatch(doc,/<script[^>]*src="\.\.\/\.\.\/experiments/);
});
