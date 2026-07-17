import uuid
from typing import List, Optional, Tuple, Type, TypeVar, Any
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
from app.schemas.resume import (
    ResumeCreate,
    ResumeUpdate,
    EducationCreate,
    EducationUpdate,
    ExperienceCreate,
    ExperienceUpdate,
    ProjectCreate,
    ProjectUpdate,
    SkillCreate,
    SkillUpdate,
    CertificateCreate,
    CertificateUpdate,
    LanguageCreate,
    LanguageUpdate,
    SocialLinkCreate,
    SocialLinkUpdate,
)
from app.repositories.resume import resume_repository
from app.core.exceptions import NotFoundException, ForbiddenException

T = TypeVar("T")

class ResumeService:
    """ResumeService managing business rules, pagination, and multi-tenant authorization."""

    def create_resume(self, db: Session, *, obj_in: ResumeCreate, user_id: uuid.UUID) -> Resume:
        """Create a resume linked to the user."""
        return resume_repository.create_with_user(db, obj_in=obj_in, user_id=user_id)

    def get_resume(self, db: Session, *, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
        """Fetch resume by ID, enforcing user ownership."""
        resume = resume_repository.get(db, id=resume_id)
        if not resume:
            raise NotFoundException(message="Resume not found.")
        if str(resume.user_id) != str(user_id):
            raise ForbiddenException(message="You do not have permission to access this resume.")
        return resume

    def list_resumes(
        self, 
        db: Session, 
        *, 
        user_id: uuid.UUID, 
        page: int = 1, 
        limit: int = 10, 
        title_query: Optional[str] = None
    ) -> Tuple[List[Resume], int]:
        """Fetch paginated lists of user resumes alongside total record counts."""
        if page < 1:
            page = 1
        skip = (page - 1) * limit
        items = resume_repository.get_by_user(
            db, user_id=user_id, skip=skip, limit=limit, title_query=title_query
        )
        total = resume_repository.count_by_user(db, user_id=user_id, title_query=title_query)
        return items, total

    def update_resume(
        self, 
        db: Session, 
        *, 
        resume_id: uuid.UUID, 
        obj_in: ResumeUpdate, 
        user_id: uuid.UUID
    ) -> Resume:
        """Update resume master properties after verifying user ownership."""
        resume = self.get_resume(db, resume_id=resume_id, user_id=user_id)
        return resume_repository.update_resume_content(db, db_obj=resume, obj_in=obj_in)

    def delete_resume(self, db: Session, *, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
        """Delete resume after verifying user ownership."""
        resume = self.get_resume(db, resume_id=resume_id, user_id=user_id)
        resume_repository.remove(db, id=resume_id)
        return resume

    # =====================================================================
    # Subcomponent Helpers with ownership checks
    # =====================================================================
    def _verify_and_get_parent_resume(
        self, db: Session, *, resume_id: uuid.UUID, user_id: uuid.UUID
    ) -> Resume:
        """Helper to ensure user owns the target parent resume before child mutations."""
        return self.get_resume(db, resume_id=resume_id, user_id=user_id)

    # Education CRUD
    def add_education(
        self, db: Session, *, resume_id: uuid.UUID, obj_in: EducationCreate, user_id: uuid.UUID
    ) -> Education:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_edu = Education(**obj_in.model_dump(), resume_id=str(resume_id))
        db.add(db_edu)
        db.commit()
        db.refresh(db_edu)
        return db_edu

    def update_education(
        self, db: Session, *, resume_id: uuid.UUID, education_id: uuid.UUID, obj_in: EducationUpdate, user_id: uuid.UUID
    ) -> Education:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_edu = db.query(Education).filter(Education.id == str(education_id), Education.resume_id == str(resume_id)).first()
        if not db_edu:
            raise NotFoundException(message="Education entry not found on this resume.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_edu, field, value)
            
        db.add(db_edu)
        db.commit()
        db.refresh(db_edu)
        return db_edu

    def delete_education(
        self, db: Session, *, resume_id: uuid.UUID, education_id: uuid.UUID, user_id: uuid.UUID
    ) -> Education:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_edu = db.query(Education).filter(Education.id == str(education_id), Education.resume_id == str(resume_id)).first()
        if not db_edu:
            raise NotFoundException(message="Education entry not found on this resume.")
        db.delete(db_edu)
        db.commit()
        return db_edu

    # Experience CRUD
    def add_experience(
        self, db: Session, *, resume_id: uuid.UUID, obj_in: ExperienceCreate, user_id: uuid.UUID
    ) -> Experience:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = Experience(**obj_in.model_dump(), resume_id=str(resume_id))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_experience(
        self, db: Session, *, resume_id: uuid.UUID, experience_id: uuid.UUID, obj_in: ExperienceUpdate, user_id: uuid.UUID
    ) -> Experience:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Experience).filter(Experience.id == str(experience_id), Experience.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Experience entry not found on this resume.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_experience(
        self, db: Session, *, resume_id: uuid.UUID, experience_id: uuid.UUID, user_id: uuid.UUID
    ) -> Experience:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Experience).filter(Experience.id == str(experience_id), Experience.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Experience entry not found on this resume.")
        db.delete(db_obj)
        db.commit()
        return db_obj

    # Project CRUD
    def add_project(
        self, db: Session, *, resume_id: uuid.UUID, obj_in: ProjectCreate, user_id: uuid.UUID
    ) -> Project:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = Project(**obj_in.model_dump(), resume_id=str(resume_id))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_project(
        self, db: Session, *, resume_id: uuid.UUID, project_id: uuid.UUID, obj_in: ProjectUpdate, user_id: uuid.UUID
    ) -> Project:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Project).filter(Project.id == str(project_id), Project.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Project entry not found on this resume.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_project(
        self, db: Session, *, resume_id: uuid.UUID, project_id: uuid.UUID, user_id: uuid.UUID
    ) -> Project:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Project).filter(Project.id == str(project_id), Project.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Project entry not found on this resume.")
        db.delete(db_obj)
        db.commit()
        return db_obj

    # Skill CRUD
    def add_skill(
        self, db: Session, *, resume_id: uuid.UUID, obj_in: SkillCreate, user_id: uuid.UUID
    ) -> Skill:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = Skill(**obj_in.model_dump(), resume_id=str(resume_id))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_skill(
        self, db: Session, *, resume_id: uuid.UUID, skill_id: uuid.UUID, obj_in: SkillUpdate, user_id: uuid.UUID
    ) -> Skill:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Skill).filter(Skill.id == str(skill_id), Skill.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Skill entry not found on this resume.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_skill(
        self, db: Session, *, resume_id: uuid.UUID, skill_id: uuid.UUID, user_id: uuid.UUID
    ) -> Skill:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Skill).filter(Skill.id == str(skill_id), Skill.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Skill entry not found on this resume.")
        db.delete(db_obj)
        db.commit()
        return db_obj

    # Certificate CRUD
    def add_certificate(
        self, db: Session, *, resume_id: uuid.UUID, obj_in: CertificateCreate, user_id: uuid.UUID
    ) -> Certificate:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = Certificate(**obj_in.model_dump(), resume_id=str(resume_id))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_certificate(
        self, db: Session, *, resume_id: uuid.UUID, certificate_id: uuid.UUID, obj_in: CertificateUpdate, user_id: uuid.UUID
    ) -> Certificate:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Certificate).filter(Certificate.id == str(certificate_id), Certificate.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Certificate entry not found on this resume.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_certificate(
        self, db: Session, *, resume_id: uuid.UUID, certificate_id: uuid.UUID, user_id: uuid.UUID
    ) -> Certificate:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Certificate).filter(Certificate.id == str(certificate_id), Certificate.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Certificate entry not found on this resume.")
        db.delete(db_obj)
        db.commit()
        return db_obj

    # Language CRUD
    def add_language(
        self, db: Session, *, resume_id: uuid.UUID, obj_in: LanguageCreate, user_id: uuid.UUID
    ) -> Language:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = Language(**obj_in.model_dump(), resume_id=str(resume_id))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_language(
        self, db: Session, *, resume_id: uuid.UUID, language_id: uuid.UUID, obj_in: LanguageUpdate, user_id: uuid.UUID
    ) -> Language:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Language).filter(Language.id == str(language_id), Language.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Language entry not found on this resume.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_language(
        self, db: Session, *, resume_id: uuid.UUID, language_id: uuid.UUID, user_id: uuid.UUID
    ) -> Language:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(Language).filter(Language.id == str(language_id), Language.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="Language entry not found on this resume.")
        db.delete(db_obj)
        db.commit()
        return db_obj

    # SocialLink CRUD
    def add_social_link(
        self, db: Session, *, resume_id: uuid.UUID, obj_in: SocialLinkCreate, user_id: uuid.UUID
    ) -> SocialLink:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = SocialLink(**obj_in.model_dump(), resume_id=str(resume_id))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_social_link(
        self, db: Session, *, resume_id: uuid.UUID, social_link_id: uuid.UUID, obj_in: SocialLinkUpdate, user_id: uuid.UUID
    ) -> SocialLink:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(SocialLink).filter(SocialLink.id == str(social_link_id), SocialLink.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="SocialLink entry not found on this resume.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_social_link(
        self, db: Session, *, resume_id: uuid.UUID, social_link_id: uuid.UUID, user_id: uuid.UUID
    ) -> SocialLink:
        self._verify_and_get_parent_resume(db, resume_id=resume_id, user_id=user_id)
        db_obj = db.query(SocialLink).filter(SocialLink.id == str(social_link_id), SocialLink.resume_id == str(resume_id)).first()
        if not db_obj:
            raise NotFoundException(message="SocialLink entry not found on this resume.")
        db.delete(db_obj)
        db.commit()
        return db_obj

resume_service = ResumeService()
