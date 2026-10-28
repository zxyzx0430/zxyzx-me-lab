# Agent / Codex Entry — ZXYZX.ME

This repository is an **independent development lab**, not the production personal website. Read docs/MODULE_STANDARD.md before any edit.

## Non-negotiable boundaries

1. Confirm the requested module ID and work only within its agreed scope. Approved visual experiments (e.g. M01 V3) may live in experiments/; do not confuse them with earlier unapproved modules/home-hero V1. Shared docs/registry edits require appropriate authorization.
2. NEVER rewrite root index.html just to change a module. It is a legacy V4 monolith.
3. M01 V3 is visually approved: read docs/module-designs/M01_HOME_APPROVED.md and tag m01-v3-visual-approved; protect composition, portrait, typography and one-gesture paging. Legacy modules/home-hero V1 is still draft, not the accepted M01. Approved knowledge-network V5 is protected. Original approved source: experiments/network-v5/ and tag knowledge-network-v5-approved. Its independent packaged module is modules/knowledge-network/. Do not change approved artwork, motion, content or graphs without explicit user approval and a new version.
4. Do not touch zxyzx.me DNS, existing Personal AI System production repos, financial data or other modules without separate instructions.
5. Distinguish approved modules from proposed roadmap modules. Do not claim the entire site is modular already.
6. For future UI components, use self-contained resources and Shadow DOM (or demonstrably equivalent style isolation), relative asset URLs, independent demos and module.json.
7. Before merging/pushing: node scripts/validate-modules.mjs; module tests; Chromium at mobile and desktop widths; git diff --name-only review. On visual edits include preview, screenshots and require user acceptance.
8. Every completion report: changes, exact paths, preview URL, version/tag, what was tested, what is still unimplemented.
9. Every approved design module follows docs/MODULE_ACCEPTANCE_AND_HANDOFF.md: preserve design philosophy, approved visual baseline, historical screenshots, version tag, and a usable thread handoff. Visual approval differs from engineering integration.

## Relevant entry points

- docs/MODULE_STANDARD.md — full architecture and development contract
- docs/module-registry.json — packaged module status and visual baseline pointer
- docs/MODULE_ACCEPTANCE_AND_HANDOFF.md — required approval and cross-thread handoff process
- docs/module-designs/M01_HOME_APPROVED.md — M01 V3 approved design blueprint
- docs/module-designs/M02_WORKS_DESIGN_BRIEF.md — M02 design-phase brief, not implemented
- modules/knowledge-network/README.md — approved knowledge graph, commands and integration API
- modules/knowledge-network/index.html — standalone preview
- experiments/network-v5/APPROVED_BASELINE.md — original frozen approval

## Git convention

Feature branches for visual changes. Keep original tags. Do not rename or replace approved assets. Scope the pull request to the module. User acceptance is required before marking a new visual version approved.
