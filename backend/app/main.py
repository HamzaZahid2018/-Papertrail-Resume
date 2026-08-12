from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.database import engine, Base
from app.api.v1.router import api_router

# Import all models so Base.metadata knows about them
import app.models  # noqa: F401

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ResumeForge API - Build and manage resumes and CVs with ease.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Register custom global exception formatters
register_exception_handlers(app)

# Auto-create tables for SQLite (dev convenience)
if settings.DATABASE_URL.startswith("sqlite"):
    Base.metadata.create_all(bind=engine)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS] if settings.BACKEND_CORS_ORIGINS else [],
    allow_origin_regex=r"https://.*|http://localhost:.*|http://127\.0\.0\.1:.*|http://192\.168\..*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints under V1 namespace prefix
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "Welcome to ResumeForge API",
        "docs_url": "/docs",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

