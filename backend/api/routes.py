from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from starlette.responses import FileResponse

from backend.core.agent import parse_agent_command
from backend.core.spec import load_spec
from backend.core.simulation import engine

router = APIRouter()
ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "backend" / "data"


@router.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@router.get("/spec")
def get_spec() -> Any:
    spec = load_spec()
    return spec.dict()


@router.get("/layers/{layer_id}")
def get_layer(layer_id: str, hour: int = Query(0, ge=0, le=24)) -> Any:
    if layer_id == "pump_stations":
        return FileResponse(DATA_DIR / "normalized" / "pumps.geojson")
    if layer_id == "drainage_network":
        return FileResponse(DATA_DIR / "normalized" / "drainage.geojson")
    if layer_id == "flood_extent":
        features = engine.get_flood_features(hour)
        return {"type": "FeatureCollection", "features": features}
    raise HTTPException(status_code=404, detail="Layer not found")


@router.get("/telemetry/pumps")
def pump_telemetry() -> Dict[str, Any]:
    status = engine.get_status()
    return {"telemetry": [{"pump_id": pump_id, "status": status[pump_id]} for pump_id in status]}


class CommandRequest(BaseModel):
    command: str


@router.post("/simulation/command")
def simulation_command(request: CommandRequest) -> Dict[str, Any]:
    try:
        parsed = parse_agent_command(request.command)
        result = engine.trigger(parsed["pump_id"], parsed["action"])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return {
        "parsed": parsed,
        "result": result,
    }


@router.post("/simulation/trigger")
def trigger_simulation(pump_id: str, action: str) -> Dict[str, Any]:
    try:
        result = engine.trigger(pump_id, action)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return {"result": result}
