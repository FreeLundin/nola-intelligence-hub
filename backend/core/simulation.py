from typing import Dict, List

PUMP_STATE: Dict[str, str] = {
    "P-101": "normal",
    "P-102": "normal",
    "P-103": "warning"
}


class SimulationEngine:
    def __init__(self):
        self.pump_state = dict(PUMP_STATE)

    def get_status(self) -> Dict[str, str]:
        return self.pump_state

    def trigger(self, pump_id: str, action: str) -> Dict[str, str]:
        if pump_id not in self.pump_state:
            raise ValueError(f"Unknown pump_id: {pump_id}")

        if action == "fail_pump":
            self.pump_state[pump_id] = "failed"
        elif action == "warn_pump":
            self.pump_state[pump_id] = "warning"
        else:
            self.pump_state[pump_id] = "normal"

        return {"pump_id": pump_id, "status": self.pump_state[pump_id]}

    def get_flood_features(self, hour: int) -> List[dict]:
        depth = min(max(0.2 * hour, 0.1), 2.5)
        return [
            {
                "type": "Feature",
                "properties": {"depth": round(depth, 2), "hour": hour},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-90.108, 29.950],
                            [-90.102, 29.950],
                            [-90.102, 29.943],
                            [-90.108, 29.943],
                            [-90.108, 29.950]
                        ]
                    ]
                }
            }
        ]


engine = SimulationEngine()
