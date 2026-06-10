# 4P3X ExplainFlow OS™

**Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™**

A 32-run V4 Enterprise-style starter build for an audience-aware explanation, evidence, pitch and report operating system.

## What is included

- React / Vite static app
- PWA manifest and service worker
- Local-first SSOT in `src/lib/storage.js`
- Demo/live mode settings
- Audience explanation generator
- Clarity transformer
- Multi-audience comparison
- 4P3X Verse™ knowledge vault
- Objection handler
- Evidence-to-explanation builder
- Pitch room / demo theatre mode
- Report pack exporter
- Enterprise readiness layer
- Supabase SQL starter schema with RLS enabled
- Base44 finish prompt in `docs/BASE44_FINISH_PROMPT.md`

## Install

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## SSOT rule

Local/demo state flows through `src/lib/storage.js`. Do not create duplicate hidden state stores.

## Live mode note

This frontend is backend-ready. Production live mode should connect Supabase/Firebase/custom backend and server-side AI calls. Never place service-role keys or private AI provider keys in frontend code.


## V5 Investor Demo + Founder Intelligence Layer — safe upgrade added

This upgrade adds Runs 33–38 without replacing the existing V4 Enterprise build. Preserve the existing SSOT, storage layer, PWA setup, navigation shell, Supabase SQL file and demo/live settings.

Added capabilities:
- Run 33: Investor Demo Journey Mode
- Run 34: Founder Capability Engine
- Run 35: Product-to-Market Mapper
- Run 36: AI Trust & Claim Safety Guard
- Run 37: 4P3X Product Family Mapper
- Run 38: Final V5 Wow Polish Pack

Validation status before handoff: npm install passed and npm run build passed.

Base44 must finish visually only unless explicitly requested: improve alignment, spacing, responsive polish, animation smoothness, accessibility labels, screenshots/logo placement and live URL testing. Do not rebuild the app, do not create duplicate routes, do not move state outside the SSOT, and do not remove the V4 Enterprise features.
