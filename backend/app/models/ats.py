import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, func, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class AtsReport(Base):
    __tablename__ = "ats_reports"

    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    resume_id: Mapped[str] = mapped_column(
        String(36), 
        nullable=True
    )
    score: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    job_title: Mapped[str] = mapped_column(
        String(255), 
        nullable=True
    )
    matched_keywords: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list
    )
    missing_keywords: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list
    )
    formatting_issues: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list
    )
    suggestions: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )

    # Note: If needed, you can add relationship to User
    # user = relationship("User", backref="ats_reports")
