from typing import Any
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.schemas.common import APIResponse
from app.services.auth import auth_service
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=APIResponse[UserResponse], status_code=201)
def register(
    user_in: UserCreate, 
    db: Session = Depends(get_db)
) -> Any:
    """Register a new user account."""
    user = auth_service.register_user(db, user_in=user_in)
    return APIResponse(success=True, data=UserResponse.model_validate(user))


@router.post("/login", response_model=APIResponse[Token])
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
) -> Any:
    """OAuth2 password flow token login."""
    user = auth_service.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    access_token = create_access_token(subject=user.id)
    return APIResponse(
        success=True, 
        data=Token(access_token=access_token, token_type="bearer")
    )


@router.get("/me", response_model=APIResponse[UserResponse])
def get_me(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Retrieve authenticated user's profile details."""
    return APIResponse(success=True, data=UserResponse.model_validate(current_user))
