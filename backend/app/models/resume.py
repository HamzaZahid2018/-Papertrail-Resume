import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    title: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    summary: Mapped[Optional[str]] = mapped_column(
        Text, 
        nullable=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User", 
        back_populates="resumes"
    )
    
    educations: Mapped[List["Education"]] = relationship(
        "Education", 
        back_populates="resume", 
        cascade="all, delete-orphan"
    )
    experiences: Mapped[List["Experience"]] = relationship(
        "Experience", 
        back_populates="resume", 
        cascade="all, delete-orphan"
    )
    projects: Mapped[List["Project"]] = relationship(
        "Project", 
        back_populates="resume", 
        cascade="all, delete-orphan"
    )
    skills: Mapped[List["Skill"]] = relationship(
        "Skill", 
        back_populates="resume", 
        cascade="all, delete-orphan"
    )
    certificates: Mapped[List["Certificate"]] = relationship(
        "Certificate", 
        back_populates="resume", 
        cascade="all, delete-orphan"
    )
    languages: Mapped[List["Language"]] = relationship(
        "Language", 
        back_populates="resume", 
        cascade="all, delete-orphan"
    )
    social_links: Mapped[List["SocialLink"]] = relationship(
        "SocialLink", 
        back_populates="resume", 
        cascade="all, delete-orphan"
    )
