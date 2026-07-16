from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")

class ErrorPayload(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class APIResponse(BaseModel, Generic[T]):
    """Standard generic wrapper returned by all end-user operations."""
    success: bool = True
    data: Optional[T] = None
    error: Optional[ErrorPayload] = None


class PaginationMeta(BaseModel):
    total_count: int
    page: int
    limit: int
    total_pages: int


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard generic structure for listing actions."""
    items: List[T]
    meta: PaginationMeta
