# Agent / Codex Entry — ZXYZX.ME

This repository is an **independent development lab**, not the production personal website. Read docs/MODULE_STANDARD.md before any edit.

## Non-negotiable boundaries

1. Confirm the requested module ID; work inside modules/<id>/ only, except when explicitly modifying central docs/registry or the site composition layer.
2. NEVER rewrite root index.html just to change a module. It is a legacy V4 monolith.
3. Approved knowledge-network V5 is protected. Original approved source: experiments/network-v5/ and tag knowledge-network-v5-approved. Its independent packaged module is modules/knowledge-network/. Do not change approved artwork, motion, content or graphs without explicit user approval and a new version.
4. Do not touch zxyzx.me DNS, existing Personal AI System production repos, financial data or other modules without separate instructions.
5. Distinguish approved modules from proposed roadmap modules. Do not claim the entire site is modular already.
6. For future UI components, use self-contained resources and Shadow DOM (or demonstrably equivalent style isolation), relative asset URLs, independent demos and module.json.
7. Before merging/pushing: node scripts/validate-modules.mjs; module tests; Chromium at mobile and desktop widths; git diff --name-only review. On visual edits include preview, screenshots and require user acceptance.
8. Every completion report: changes, exact paths, preview URL, version/tag, what was tested, what is still unimplemented.

## Relevant entry points

- docs/MODULE_STANDARD.md — full architecture and development contract
- docs/module-registry.json — registered modules and status
- modules/knowledge-network/README.md — approved knowledge graph, commands and integration API
- modules/knowledge-network/index.html — standalone preview
- experiments/network-v5/APPROVED_BASELINE.md — original frozen approval

## Git convention

Feature branches for visual changes. Keep original tags. Do not rename or replace approved assets. Scope the pull request to the module. User acceptance is required before marking a new visual version approved.
