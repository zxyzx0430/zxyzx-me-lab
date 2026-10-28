import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(repo, p), "utf8"));
const exists = (p) => fs.existsSync(path.join(repo, p));
const sha256 = (p) => crypto.createHash("sha256").update(fs.readFileSync(path.join(repo, p))).digest("hex");
const registry = readJson("docs/module-registry.json");
if (registry.schemaVersion !== 1 || !Array.isArray(registry.modules)) throw Error("Invalid registry schema");
let count = 0;
for (const item of registry.modules) {
  const id = item.id;
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)) throw Error("Bad module ID: " + id);
  if (item.path !== "modules/" + id) throw Error("Module path mismatch: " + id);
  const root = item.path;
  const manifest = readJson(root + "/module.json");
  if (manifest.schemaVersion !== 1 || manifest.id !== id || manifest.version !== item.version || manifest.status !== item.status) {
    throw Error("Registry/manifest mismatch: " + id);
  }
  for (const prop of ["entry", "style", "preview"]) {
    if (typeof manifest[prop] !== "string" || manifest[prop].startsWith("/") || manifest[prop].includes("..")) {
      throw Error("Invalid " + prop + " path for " + id);
    }
    if (!exists(root + "/" + manifest[prop])) throw Error("Missing " + prop + ": " + id);
  }
  for (const file of ["README.md", "module.css", "module.js"]) {
    if (!exists(root + "/" + file)) throw Error("Required module file missing: " + root + "/" + file);
  }
  if (manifest.status === "approved" && !manifest.approvedTag) throw Error("Approved module without tag");
  if (manifest.assets?.video) {
    const file = root + "/" + manifest.assets.video;
    if (!exists(file)) throw Error("Missing video: " + file);
    if (manifest.assets.videoSha256 && sha256(file) !== manifest.assets.videoSha256) {
      throw Error("APPROVED VIDEO HASH CHANGED: " + id);
    }
  }
  count++;
  console.log("✓ " + id + " v" + manifest.version + " [" + manifest.status + "] — paths & media verified");
}
console.log("Module validation passed (" + count + " registered).");
