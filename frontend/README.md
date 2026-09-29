# BhoomiNITI AI

Frontend demo for PlotArmor's Smart India Hackathon 2026 submission (SIH26019). The app follows the attached architecture map: data ingestion and RBAC feed four parallel engines (GIS Change, Evidence RAG, Policy Scenario, and Blockchain Provenance) through one FastAPI-ready client layer into five judge-facing outputs.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The demo works without a backend using typed, realistic mock data. Set `NEXT_PUBLIC_API_BASE_URL` when the FastAPI service is ready; components continue to call only `lib/api.ts`.

## Included screens

- Login / session setup with role selection and session-only BYOK key
- Role-aware app shell
- Geo-temporal land change view with Leaflet map, hotspots, matrix and statistics
- Evidence-grounded search with citations and corpus panel
- Policy scenario comparison with Recharts trend view
- SHA-256 provenance ledger with chain visualization
- Decision report generation flow

This repository intentionally contains frontend code only: no Docker, database, or backend implementation.