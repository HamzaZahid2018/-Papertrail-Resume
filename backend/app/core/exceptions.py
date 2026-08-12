from typing import Any, Dict, Optional
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

class AppException(Exception):
    """Base application exception for consistent API error output."""
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Any] = None
    ):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="NOT_FOUND",
            message=message,
            details=details
        )


class AuthException(AppException):
    def __init__(self, message: str = "Could not authenticate user", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message=message,
            details=details
        )


class ForbiddenException(AppException):
    def __init__(self, message: str = "Permission denied", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            message=message,
            details=details
        )


class BadRequestException(AppException):
    def __init__(self, message: str = "Bad request", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="BAD_REQUEST",
            message=message,
            details=details
        )


def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers for formatting consistent error responses."""
    
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details
                }
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        # Format Pydantic errors into a cleaner key-value dictionary
        details = {}
        for error in exc.errors():
            loc = " -> ".join(str(x) for x in error.get("loc", []))
            details[loc] = error.get("msg")
            
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Schema validation failed",
                    "details": details
                }
            }
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        # Translate generic FastAPI/Starlette HTTP exceptions
        code = "HTTP_ERROR"
        if exc.status_code == 404:
            code = "NOT_FOUND"
        elif exc.status_code == 401:
            code = "UNAUTHORIZED"
        elif exc.status_code == 403:
            code = "FORBIDDEN"
        elif exc.status_code == 405:
            code = "METHOD_NOT_ALLOWED"
            
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": code,
                    "message": exc.detail,
                    "details": None
                }
            }
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        # Catch-all fallback for unhandled standard runtime errors with sanitized logging
        import logging
        import re

        raw_err = str(exc)
        # Strip database credentials, passwords, and sensitive params
        sanitized_err = re.sub(r'://[^:@]+:[^@]+@', '://***:***@', raw_err)
        sanitized_err = re.sub(r'password=[\w!@#$%^&*()]+', 'password=***', sanitized_err, flags=re.IGNORECASE)

        logging.error(f"[SERVER/DATABASE ERROR] Path: {request.url.path} | Error: {sanitized_err}")

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred on the server.",
                    "details": None
                }
            }
        )
