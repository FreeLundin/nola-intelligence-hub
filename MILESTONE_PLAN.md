# NIH Milestone Plan (Sprints)

## Team Roles
- **Product Owner / PM** — scope and acceptance criteria
- **Tech Lead** — architecture and code reviews
- **Frontend Engineer(s)** — React, Deck.gl, Mapbox integration
- **Backend Engineer(s)** — FastAPI, Pydantic, WebSockets
- **Data Engineer** — GeoPandas pipeline, tile generation
- **DevOps / SRE** — CI/CD, containerization, infra
- **QA / Test Engineer** — automated and manual testing

## Sprint 0 — Repo + Infra (1 week)
- Tasks: repo scaffold, CI skeleton, `scenario_spec.json` sample, dev manifests.
- Acceptance: `GET /spec` returns `scenario_spec.json`; frontend `npm run dev` starts.

## Sprint 1 — Base Map & Deck (2 weeks)
- Tasks: React + Tailwind setup; Mapbox + Deck.gl overlay; map centers on spec center.
- Acceptance: Map loads, centers on spec coordinates, Deck overlay renders sample points at 60fps on development tablet.

## Sprint 2 — Spec-Driven Layer Manager + Backend (2 weeks)
- Tasks: Pydantic schema validation, `/spec` endpoint, frontend LayerManager toggling geojson/vector sources.
- Acceptance: Frontend toggles layers described in spec; `/spec` validates against schema.

## Sprint 3 — Data Pipeline & X-Ray Mode (2 weeks)
- Tasks: GeoPandas clipping/normalization scripts; mock SCADA websocket; X-Ray UI mode (infrastructure highlight).
- Acceptance: X-Ray toggles hide base map and show infrastructure graph; mock telemetry updates pump states in UI.

## Sprint 4 — Temporal Slider & Interpolation (2 weeks)
- Tasks: Prefetch MVT tiles per hour; implement slider and GPU interpolation between steps.
- Acceptance: Sliding 0→24h smoothly animates flood extents; risk panel updates counts of at-risk assets.

## Sprint 5 — Agent Integration & Polishing (2 weeks)
- Tasks: Command bar + intent resolver; `POST /simulation/trigger` stub; visual feedback for what-if.
- Acceptance: Example commands like "Fail pump P-101" trigger backend call, map zooms and shows red pulse.

## Acceptance Criteria (project-level)
- Decision latency < 10s for most queries; agent command latency < 2s for simple state changes.
- Tablet-first responsive UI.
- Audit logs for all simulations and agent actions.

## Delivery Notes
- Each sprint ends with a demo to stakeholders and an automated integration test run.
- Prioritize security and signing for scenario tile access before production deployment.