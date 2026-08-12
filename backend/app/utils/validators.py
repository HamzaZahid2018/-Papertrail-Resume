from typing import List, Dict, Any

def validate_ats_response(data: Dict[str, Any]) -> None:
    """
    Validates that the parsed ATS response contains the required fields.
    Raises ValueError if fields are missing or of incorrect types.
    """
    required_fields = {
        "score": (int, float),
        "matched_keywords": list,
        "missing_keywords": list,
        "formatting_issues": list,
        "suggestions": list
    }

    for field, expected_type in required_fields.items():
        if field not in data:
            raise ValueError(f"Missing required field in ATS response: {field}")
        
        val = data[field]
        if not isinstance(val, expected_type):
            raise ValueError(f"Field '{field}' should be of type {expected_type}, got {type(val)}")
        
        # Additional list content validation could go here if needed.
