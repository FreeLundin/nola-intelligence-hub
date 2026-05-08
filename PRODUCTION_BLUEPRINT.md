# NOLA Intelligence Hub — Production Blueprint

## Overview
This document describes a production-ready blueprint for NIH: a spec-driven Web-GIS Command Center built with React + Mapbox GL JS + Deck.gl (frontend) and FastAPI + GeoPandas (backend). Design goals: low-latency, high data density, tablet support, and transparent simulation audit.

## Folder Layout
- `/backend` — FastAPI app, Pydantic models, GIS pipeline scripts
- `/frontend` — React app (Vite), Tailwind CSS, Deck.gl layers
- `/shared` — `scenario_spec.json` and related schemas
- `/data` — raw, normalized, and precomputed tile artifacts

## Backend
- FastAPI with Pydantic spec validation endpoint (`GET /spec`) and simulation endpoints (`POST /simulation/trigger`).
- WebSocket endpoint for telemetry streaming (`/ws/pumps`).
- Suggested services: TimescaleDB/InfluxDB for time-series; PostGIS for spatial queries when needed.

## Frontend
- React + Vite + Tailwind.
- Map container using Mapbox GL JS as the basemap and Deck.gl `DeckGL` overlay for GPU-accelerated layers (HexagonLayer, PolygonLayer, PathLayer, IconLayer).
- LayerManager reads `scenario_spec.json` and dynamically toggles sources and Deck layers.

## Data Pipeline (Vector Tile approach)
1. Simulation outputs (SWMM/HEC-RAS) → GeoJSON (per timestep).
2. Use Tippecanoe to convert time-step GeoJSONs to an MVT tileset (per scenario/time).
   - Example: `tippecanoe -o scenario_01.mbtiles -zg --drop-densest-as-needed --extend-zooms-if-still-dropping *.geojson`
3. Serve tiles from S3 + CloudFront or tile server (tileserver-gl, Fastly, or custom FastAPI signed tile endpoints).

## AI Orchestration
- Agent receives natural language commands, resolves location/assets, and issues simulation requests to backend.
- All agent actions write an audit entry with: user, command, resolved assets, model/intent, timestamp, simulation-request-id.

## Telemetry & SCADA
- Ingest SCADA via a bridge into TimeSeries DB.
- Expose a lightweight WebSocket proxy to push telemetry to connected clients.

## Deployment & Infra
- Containerize backend and frontend.
- Recommend EKS/AKS or App Service + Container Registry for managed hosting.
- Tiles: S3 (static) behind CloudFront for scale; consider signed URLs for scenario access control.
- Observability: Prometheus + Grafana, Application Insights / Datadog for traces, Sentry for frontend errors.

## Security
- Authenticate users with OIDC (Azure AD/GitHub/Okta).
- Role-based access control (who can run simulations / publish tiles).
- Signed tile URLs for private scenarios.

## CI/CD
- Build and test on PRs; lint + unit tests; build Docker images for backend and frontend; deploy to staging on merge to `main`.

## Dev Commands (local)
```bash
# Backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# Frontend
npm install
npm run dev
```

## Performance & KPIs
- Maintain 60 fps on commodity tablets when rendering GPU layers.
- Agent command → visual update latency < 2s (network-dependent).
- Availability: 99.9% during incidents.

## Notes
- Use precomputed vector tiles for high-density time-series visualization. Tippecanoe + S3 is low-cost and performant for precomputed simulation states.
- Keep simulation outputs versioned and attached to scenario metadata for auditability.