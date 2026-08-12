import json
import re
from typing import Any, Dict

def parse_json_safely(content: str) -> Dict[str, Any]:
    """
    Strips markdown code fences and safely parses JSON.
    Raises ValueError if parsing fails.
    """
    # Remove markdown code fences if present
    content = content.strip()
    if content.startswith("```"):
        # Find the first newline after the opening fence
        newline_idx = content.find("\n")
        if newline_idx != -1:
            content = content[newline_idx + 1:]
        if content.endswith("```"):
            content = content[:-3]
    
    content = content.strip()
    
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}")
