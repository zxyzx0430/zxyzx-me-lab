/**
 * New DRAFT module scaffolder. Does not register, approve, deploy, or touch existing modules.
 * Usage: node scripts/new-module.mjs <kebab-case-id>
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const name=process.argv[2];
if(!name || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)){
  console.error("Usage: node scripts/new-module.mjs <kebab-case-id>");
  process.exit(2);
}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const folder=path.join(root,"modules",name);
if(fs.existsSync(folder)){
  console.error("Module already exists; no changes made: "+name);
  process.exit(1);
}
fs.mkdirSync(folder,{recursive:false});
fs.mkdirSync(path.join(folder,"assets"));
fs.mkdirSync(path.join(folder,"tests"));
const json={schemaVersion:1,id:name,displayName:name,version:"0.1.0",status:"draft",approvedTag:null,entry:"module.js",style:"module.css",preview:"index.html",assets:{},runtimeDependencies:[],publicApi:{attributes:[],methods:[],events:[]}};
fs.writeFileSync(path.join(folder,"module.json"),JSON.stringify(json,null,2)+"\n");
const js=[
  'const id = "'+name+'";',
  'class DraftModule extends HTMLElement {',
  '  constructor(){super();this.attachShadow({mode:"open"});}',
  '  connectedCallback(){',
  '    this.shadowRoot.innerHTML = \'<link rel="stylesheet" href="\'+new URL("./module.css",import.meta.url).href+\'"><section role="region" aria-label="'+name+'">Draft: '+name+'</section>\';',
  '  }',
  '}',
  'if(!customElements.get("zxyzx-'+name+'"))customElements.define("zxyzx-'+name+'",DraftModule);',
  'export default DraftModule;'
].join("\n")+"\n";
fs.writeFileSync(path.join(folder,"module.js"),js);
fs.writeFileSync(path.join(folder,"module.css"),':host{display:block}section{font:16px system-ui,sans-serif;padding:2rem;border:1px solid #aaa}\n');
fs.writeFileSync(path.join(folder,"index.html"),[
 '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
 '<title>Draft: '+name+'</title><script type="module" src="./module.js"></script></head>',
 '<body><h1>Module draft: '+name+'</h1><zxyzx-'+name+'></zxyzx-'+name+'></body></html>'
].join("\n")+"\n");
fs.writeFileSync(path.join(folder,"README.md"),"# "+name+"\n\nStatus: DRAFT — not approved, not registered, not included in the homepage.\n\nRead ../../docs/MODULE_STANDARD.md. Build and test this module independently; register it only when ready for integration.\n");
console.log("Created draft module: modules/"+name+"/");
console.log("Next: implement, preview, test; update docs/module-registry.json when integration-ready.");
