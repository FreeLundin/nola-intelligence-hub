# NOLA Intelligence Hub (MVP)

A minimal Web-GIS MVP for the NOLA Intelligence Hub.

## Backend
Commands from repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

## Frontend
Commands from `/frontend`:

```powershell
cd frontend
npm install
copy .env.example .env
# set VITE_MAPBOX_TOKEN in .env
npm run dev
```

## What is included
- FastAPI backend with `/health`, `/spec`, `/layers/*`, `/telemetry/pumps` and `/simulation/trigger`
- React + Vite frontend with Mapbox GL JS + Deck.gl GPU layers
- A temporal flood slider, command bar, and operational layer toggles
- Sample GeoJSON pump and drainage data
