import time
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.ats_service import perform_ats_check
from app.schemas.ats import AtsCheckResponse

router = APIRouter(prefix="/ats", tags=["ats"])

# Simple in-memory rate limiting dict: {ip: [timestamps]}
rate_limits = {}
RATE_LIMIT = 10
RATE_WINDOW = 60 # seconds

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    if client_ip not in rate_limits:
        rate_limits[client_ip] = []
        
    # Remove timestamps older than the window
    rate_limits[client_ip] = [ts for ts in rate_limits[client_ip] if now - ts < RATE_WINDOW]
    
    if len(rate_limits[client_ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait before trying again.")
        
    rate_limits[client_ip].append(now)

@router.post("/ats-check", response_model=AtsCheckResponse)
async def api_ats_check(
    request: Request,
    job_description: str = Form(...),
    resume_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_rate_limit(request)
    
    try:
        result = await perform_ats_check(db, current_user.id, resume_file, job_description)
        return result
    except HTTPException as e:
        # Re-raise HTTP exceptions to be handled by FastAPI
        raise e
    except Exception as e:
        print(f"ATS Check Error: {e}")
        # Return generic error to frontend
        raise HTTPException(status_code=500, detail="An error occurred while evaluating the resume.")
