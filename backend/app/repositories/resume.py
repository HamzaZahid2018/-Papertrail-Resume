import uuid
from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.models.resume_details import (
    Education,
    Experience,
    Project,
    Skill,
    Certificate,
    Language,
    SocialLink,
)
from app.schemas.resume import ResumeCreate, ResumeUpdate
from app.repositories.base import BaseRepository

class ResumeRepository(BaseRepository[Resume, ResumeCreate, ResumeUpdate]):
    """ResumeRepository handling DB queries, pagination, search and atomic subcomponent insertions."""

    def get_by_user(
        self, 
        db: Session, 
        *, 
        user_id: uuid.UUID, 
        skip: int = 0, 
        limit: int = 10, 
        title_query: Optional[str] = None
    ) -> List[Resume]:
        """Fetch multiple resumes belonging to a user with pagination and title search filters."""
        query = db.query(self.model).filter(self.model.user_id == user_id)
        if title_query:
            query = query.filter(self.model.title.ilike(f"%{title_query}%"))
        return query.order_by(self.model.updated_at.desc()).offset(skip).limit(limit).all()

    def count_by_user(
        self, 
        db: Session, 
        *, 
        user_id: uuid.UUID, 
        title_query: Optional[str] = None
    ) -> int:
        """Count total resumes belonging to a user matching search filters."""
        query = db.query(func.count(self.model.id)).filter(self.model.user_id == user_id)
        if title_query:
            query = query.filter(self.model.title.ilike(f"%{title_query}%"))
        return query.scalar() or 0

    def create_with_user(
        self, 
        db: Session, 
        *, 
        obj_in: ResumeCreate, 
        user_id: uuid.UUID
    ) -> Resume:
        """Create a resume atomically including any nested subcomponents."""
        # Convert schema to dict, pop out relation fields
        data = obj_in.model_dump()
        educations_data = data.pop("educations", []) or []
        experiences_data = data.pop("experiences", []) or []
        projects_data = data.pop("projects", []) or []
        skills_data = data.pop("skills", []) or []
        certificates_data = data.pop("certificates", []) or []
        languages_data = data.pop("languages", []) or []
        social_links_data = data.pop("social_links", []) or []

        # Create master record
        db_obj = Resume(**data, user_id=user_id)
        db.add(db_obj)
        db.flush() # Flush to populate db_obj.id

        # Insert nested subcomponents linked to the newly created resume
        for item in educations_data:
            db.add(Education(**item, resume_id=db_obj.id))
        for item in experiences_data:
            db.add(Experience(**item, resume_id=db_obj.id))
        for item in projects_data:
            db.add(Project(**item, resume_id=db_obj.id))
        for item in skills_data:
            db.add(Skill(**item, resume_id=db_obj.id))
        for item in certificates_data:
            db.add(Certificate(**item, resume_id=db_obj.id))
        for item in languages_data:
            db.add(Language(**item, resume_id=db_obj.id))
        for item in social_links_data:
            db.add(SocialLink(**item, resume_id=db_obj.id))

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_resume_content(
        self,
        db: Session,
        *,
        db_obj: Resume,
        obj_in: ResumeUpdate
    ) -> Resume:
        """
        Updates the resume master properties. 
        Note: Nested components are managed dynamically via specific sub-routers 
        for cleaner API design and finer granularity.
        """
        update_data = obj_in.model_dump(exclude_unset=True)
        # Exclude subcomponent keys during direct model updates
        subcomponents = ["educations", "experiences", "projects", "skills", "certificates", "languages", "social_links"]
        for key in subcomponents:
            update_data.pop(key, None)

        for field in update_data:
            setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    # Generic helpers to handle subcomponent updates directly on a single session
    def add_education(self, db: Session, *, resume_id: uuid.UUID, obj_in: Education) -> Education:
        db.add(obj_in)
        db.commit()
        db.refresh(obj_in)
        return obj_in

    def remove_education(self, db: Session, *, education_id: uuid.UUID) -> Optional[Education]:
        obj = db.query(Education).filter(Education.id == education_id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj
        
    # Similar helpers can be utilized in services to manipulate items
    # by querying the sub-tables directly via Session.
    
resume_repository = ResumeRepository(Resume)
