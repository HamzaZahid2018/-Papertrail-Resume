from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.resume import router as resume_router
from app.api.v1.atsCheck import router as ats_router

api_router = APIRouter()

# Include sub-routers into base API router
api_router.include_router(auth_router)
api_router.include_router(resume_router)
api_router.include_router(ats_router)
