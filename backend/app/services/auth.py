from typing import Optional, Any
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.repositories.user import user_repository
from app.core.security import get_password_hash, verify_password
from app.core.exceptions import BadRequestException, AuthException, NotFoundException

class AuthService:
    """AuthService managing user lifecycle registrations and authentication validations."""
    
    def register_user(self, db: Session, *, user_in: UserCreate) -> User:
        """Register a new user after verifying that the email address is unique."""
        existing_user = user_repository.get_by_email(db, email=user_in.email)
        if existing_user:
            raise BadRequestException(
                message="A user with this email address already exists."
            )
            
        hashed_password = get_password_hash(user_in.password)
        # Create a new user with hashed password
        db_obj = User(
            email=user_in.email,
            hashed_password=hashed_password,
            is_active=True
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate_user(self, db: Session, *, email: str, password: str) -> User:
        """Authenticate user credentials and return the matched User record."""
        user = user_repository.get_by_email(db, email=email)
        if not user:
            raise AuthException(message="Incorrect email or password.")
            
        if not verify_password(password, user.hashed_password):
            raise AuthException(message="Incorrect email or password.")
            
        if not user.is_active:
            raise AuthException(message="This user account has been deactivated.")
            
        return user

    def get_user_by_id(self, db: Session, *, user_id: Any) -> User:
        """Retrieve user profile data or raise NotFoundException."""
        user = user_repository.get(db, id=user_id)
        if not user:
            raise NotFoundException(message="User not found.")
        return user

auth_service = AuthService()
