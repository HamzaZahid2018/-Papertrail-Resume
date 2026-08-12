from typing import List
from pydantic import BaseModel, Field

class AtsCheckResponse(BaseModel):
    score: int = Field(..., ge=0, le=100)
    matched_keywords: List[str]
    missing_keywords: List[str]
    formatting_issues: List[str]
    suggestions: List[str]
