import uuid
from datetime import date, datetime
from typing import Optional
from sqlalchemy import String, Text, Boolean, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Education(Base):
    __tablename__ = "education"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("resumes.id", ondelete="CASCADE"), 
        nullable=False
    )
    institution: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    degree: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    field_of_study: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    start_date: Mapped[Optional[date]] = mapped_column(
        Date, 
        nullable=True
    )
    end_date: Mapped[Optional[date]] = mapped_column(
        Date, 
        nullable=True
    )
    description: Mapped[Optional[str]] = mapped_column(
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
    resume: Mapped["Resume"] = relationship(
        "Resume", 
        back_populates="educations"
    )


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("resumes.id", ondelete="CASCADE"), 
        nullable=False
    )
    company: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    position: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    location: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    start_date: Mapped[Optional[date]] = mapped_column(
        Date, 
        nullable=True
    )
    end_date: Mapped[Optional[date]] = mapped_column(
        Date, 
        nullable=True
    )
    is_current: Mapped[bool] = mapped_column(
        Boolean, 
        default=False, 
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
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
    resume: Mapped["Resume"] = relationship(
        "Resume", 
        back_populates="experiences"
    )


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("resumes.id", ondelete="CASCADE"), 
        nullable=False
    )
    name: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text, 
        nullable=True
    )
    role: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True
    )
    url: Mapped[Optional[str]] = mapped_column(
        String(1024), 
        nullable=True
    )
    start_date: Mapped[Optional[date]] = mapped_column(
        Date, 
        nullable=True
    )
    end_date: Mapped[Optional[date]] = mapped_column(
        Date, 
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
    resume: Mapped["Resume"] = relationship(
        "Resume", 
        back_populates="projects"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("resumes.id", ondelete="CASCADE"), 
        nullable=False
    )
    name: Mapped[str] = mapped_column(
        String(100), 
        nullable=False
    )
    level: Mapped[Optional[str]] = mapped_column(
        String(50), 
        nullable=True
    )
    category: Mapped[Optional[str]] = mapped_column(
        String(100), 
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
    resume: Mapped["Resume"] = relationship(
        "Resume", 
        back_populates="skills"
    )


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("resumes.id", ondelete="CASCADE"), 
        nullable=False
    )
    name: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    issuer: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    issue_date: Mapped[Optional[date]] = mapped_column(
        Date, 
        nullable=True
    )
    expiry_date: Mapped[Optional[date]] = mapped_column(
        Date, 
        nullable=True
    )
    url: Mapped[Optional[str]] = mapped_column(
        String(1024), 
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
    resume: Mapped["Resume"] = relationship(
        "Resume", 
        back_populates="certificates"
    )


class Language(Base):
    __tablename__ = "languages"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("resumes.id", ondelete="CASCADE"), 
        nullable=False
    )
    name: Mapped[str] = mapped_column(
        String(100), 
        nullable=False
    )
    proficiency: Mapped[Optional[str]] = mapped_column(
        String(100), 
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
    resume: Mapped["Resume"] = relationship(
        "Resume", 
        back_populates="languages"
    )


class SocialLink(Base):
    __tablename__ = "social_links"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("resumes.id", ondelete="CASCADE"), 
        nullable=False
    )
    platform: Mapped[str] = mapped_column(
        String(100), 
        nullable=False
    )
    url: Mapped[str] = mapped_column(
        String(1024), 
        nullable=False
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
    resume: Mapped["Resume"] = relationship(
        "Resume", 
        back_populates="social_links"
    )
