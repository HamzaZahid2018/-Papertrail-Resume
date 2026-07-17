import uuid
from typing import Generator
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import AuthException
from app.models.user import User
from app.services.auth import auth_service
from app.schemas.user import TokenPayload

# Standard OAuth2 flow security scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> User:
    """Validate bearer token and retrieve active user context."""
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            raise AuthException(message="Could not validate credentials: sub claim missing.")
    except JWTError:
        raise AuthException(message="Could not validate credentials: token format invalid.")
        
    try:
        user_uuid = uuid.UUID(token_data.sub)
        user_id_str = str(user_uuid)
    except ValueError:
        raise AuthException(message="Could not validate credentials: sub format invalid.")

    user = auth_service.get_user_by_id(db, user_id=user_id_str)
    if not user.is_active:
        raise AuthException(message="User account is inactive.")
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Enforce that current user context is active."""
    return current_user
