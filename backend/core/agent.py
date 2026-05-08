import re
from typing import Dict

from backend.core.simulation import PUMP_STATE

ACTION_KEYWORDS = {
    "fail": "fail_pump",
    "failed": "fail_pump",
    "failure": "fail_pump",
    "shutdown": "fail_pump",
    "stop": "fail_pump",
    "warn": "warn_pump",
    "warning": "warn_pump",
    "alert": "warn_pump",
    "degrade": "warn_pump",
    "restore": "normal",
    "reset": "normal",
    "recover": "normal",
    "repair": "normal",
}

LOCATION_PUMP_MAP = {
    "tchoupitoulas": "P-101",
    "uptown": "P-102",
    "riverbend": "P-103",
    "river": "P-103",
    "canal": "P-101",
}


def parse_agent_command(command: str) -> Dict[str, str]:
    normalized = command.strip().lower()
    if not normalized:
        raise ValueError("Empty command string")

    action = "fail_pump"
    for keyword, mapped in ACTION_KEYWORDS.items():
        if keyword in normalized:
            action = mapped
            break

    pump_id = None
    explicit = re.search(r"\bP[- ]?(\d{2,3})\b", normalized)
    if explicit:
        pump_id = f"P-{int(explicit.group(1))}"
    else:
        pump_number = re.search(r"\bpump(?:\s+number)?\s*(\d{2,3})\b", normalized)
        if pump_number:
            pump_id = f"P-{int(pump_number.group(1))}"

    if not pump_id:
        for location, pid in LOCATION_PUMP_MAP.items():
            if location in normalized:
                pump_id = pid
                break

    if not pump_id:
        pump_id = "P-101"

    if pump_id not in PUMP_STATE:
        raise ValueError(f"Unknown pump identifier: {pump_id}")

    return {
        "command": command,
        "action": action,
        "pump_id": pump_id,
        "resolved_from": "explicit" if explicit else "implicit",
    }
