from pathlib import Path
from typing import List, Optional

from pydantic import BaseModel, Field, ValidationError

ROOT = Path(__file__).resolve().parents[2]
SPEC_PATH = ROOT / "shared" / "scenario_spec.json"

class LayerSpec(BaseModel):
    id: str
    name: Optional[str]
    type: str
    source: Optional[str]
    tileUrlTemplate: Optional[str]
    initialVisibility: Optional[bool] = True
    order: Optional[int] = 0
    telemetryBinding: Optional[dict] = None
    style: Optional[dict] = None
    timeSeries: Optional[dict] = None

class SimulationSpec(BaseModel):
    timeUnits: str
    durationHours: int
    interpolation: Optional[str] = "linear"
    agentBindings: Optional[dict] = None

class ScenarioSpec(BaseModel):
    scenario_id: str
    title: Optional[str]
    description: Optional[str]
    center: List[float] = Field(..., min_items=2, max_items=2)
    zoom: Optional[float] = 12.0
    bounds: Optional[List[float]] = Field(None, min_items=4, max_items=4)
    layers: List[LayerSpec]
    simulation: SimulationSpec
    metadata: Optional[dict] = None


def load_spec() -> ScenarioSpec:
    try:
        return ScenarioSpec.parse_file(SPEC_PATH)
    except ValidationError as exc:
        raise RuntimeError(f"Scenario spec is invalid: {exc}")
