import uuid
from typing import Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.common import APIResponse, PaginatedResponse, PaginationMeta
from app.schemas.resume import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    EducationCreate,
    EducationUpdate,
    EducationResponse,
    ExperienceCreate,
    ExperienceUpdate,
    ExperienceResponse,
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    SkillCreate,
    SkillUpdate,
    SkillResponse,
    CertificateCreate,
    CertificateUpdate,
    CertificateResponse,
    LanguageCreate,
    LanguageUpdate,
    LanguageResponse,
    SocialLinkCreate,
    SocialLinkUpdate,
    SocialLinkResponse,
)
from app.services.resume import resume_service

router = APIRouter(prefix="/resumes", tags=["Resumes"])

# =====================================================================
# Master Resume Endpoints
# =====================================================================

@router.post("", response_model=APIResponse[ResumeResponse], status_code=201)
def create_resume(
    resume_in: ResumeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Create a new resume, optionally embedding nested subcomponents."""
    resume = resume_service.create_resume(db, obj_in=resume_in, user_id=current_user.id)
    return APIResponse(success=True, data=ResumeResponse.model_validate(resume))


@router.get("", response_model=APIResponse[PaginatedResponse[ResumeResponse]])
def list_resumes(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Filter resumes by title"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """List authenticated user resumes with search filters and pagination."""
    items, total = resume_service.list_resumes(
        db, user_id=current_user.id, page=page, limit=limit, title_query=search
    )
    total_pages = (total + limit - 1) // limit
    
    meta = PaginationMeta(
        total_count=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )
    
    data = PaginatedResponse(
        items=[ResumeResponse.model_validate(i) for i in items],
        meta=meta
    )
    return APIResponse(success=True, data=data)


@router.get("/{resume_id}", response_model=APIResponse[ResumeResponse])
def get_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get a resume by ID, including nested lists."""
    resume = resume_service.get_resume(db, resume_id=resume_id, user_id=current_user.id)
    return APIResponse(success=True, data=ResumeResponse.model_validate(resume))


@router.put("/{resume_id}", response_model=APIResponse[ResumeResponse])
def update_resume(
    resume_id: uuid.UUID,
    resume_in: ResumeUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update master properties of a resume (nested updates handled by sub-routers)."""
    resume = resume_service.update_resume(
        db, resume_id=resume_id, obj_in=resume_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=ResumeResponse.model_validate(resume))


@router.delete("/{resume_id}", response_model=APIResponse[ResumeResponse])
def delete_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Delete a resume and all nested entries."""
    resume = resume_service.delete_resume(db, resume_id=resume_id, user_id=current_user.id)
    return APIResponse(success=True, data=ResumeResponse.model_validate(resume))


# =====================================================================
# Education Subcomponent Endpoints
# =====================================================================

@router.post("/{resume_id}/education", response_model=APIResponse[EducationResponse], status_code=201)
def add_education(
    resume_id: uuid.UUID,
    obj_in: EducationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    edu = resume_service.add_education(db, resume_id=resume_id, obj_in=obj_in, user_id=current_user.id)
    return APIResponse(success=True, data=EducationResponse.model_validate(edu))


@router.put("/{resume_id}/education/{education_id}", response_model=APIResponse[EducationResponse])
def update_education(
    resume_id: uuid.UUID,
    education_id: uuid.UUID,
    obj_in: EducationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    edu = resume_service.update_education(
        db, resume_id=resume_id, education_id=education_id, obj_in=obj_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=EducationResponse.model_validate(edu))


@router.delete("/{resume_id}/education/{education_id}", response_model=APIResponse[EducationResponse])
def delete_education(
    resume_id: uuid.UUID,
    education_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    edu = resume_service.delete_education(db, resume_id=resume_id, education_id=education_id, user_id=current_user.id)
    return APIResponse(success=True, data=EducationResponse.model_validate(edu))


# =====================================================================
# Experience Subcomponent Endpoints
# =====================================================================

@router.post("/{resume_id}/experience", response_model=APIResponse[ExperienceResponse], status_code=201)
def add_experience(
    resume_id: uuid.UUID,
    obj_in: ExperienceCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.add_experience(db, resume_id=resume_id, obj_in=obj_in, user_id=current_user.id)
    return APIResponse(success=True, data=ExperienceResponse.model_validate(item))


@router.put("/{resume_id}/experience/{experience_id}", response_model=APIResponse[ExperienceResponse])
def update_experience(
    resume_id: uuid.UUID,
    experience_id: uuid.UUID,
    obj_in: ExperienceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.update_experience(
        db, resume_id=resume_id, experience_id=experience_id, obj_in=obj_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=ExperienceResponse.model_validate(item))


@router.delete("/{resume_id}/experience/{experience_id}", response_model=APIResponse[ExperienceResponse])
def delete_experience(
    resume_id: uuid.UUID,
    experience_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.delete_experience(db, resume_id=resume_id, experience_id=experience_id, user_id=current_user.id)
    return APIResponse(success=True, data=ExperienceResponse.model_validate(item))


# =====================================================================
# Project Subcomponent Endpoints
# =====================================================================

@router.post("/{resume_id}/projects", response_model=APIResponse[ProjectResponse], status_code=201)
def add_project(
    resume_id: uuid.UUID,
    obj_in: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.add_project(db, resume_id=resume_id, obj_in=obj_in, user_id=current_user.id)
    return APIResponse(success=True, data=ProjectResponse.model_validate(item))


@router.put("/{resume_id}/projects/{project_id}", response_model=APIResponse[ProjectResponse])
def update_project(
    resume_id: uuid.UUID,
    project_id: uuid.UUID,
    obj_in: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.update_project(
        db, resume_id=resume_id, project_id=project_id, obj_in=obj_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=ProjectResponse.model_validate(item))


@router.delete("/{resume_id}/projects/{project_id}", response_model=APIResponse[ProjectResponse])
def delete_project(
    resume_id: uuid.UUID,
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.delete_project(db, resume_id=resume_id, project_id=project_id, user_id=current_user.id)
    return APIResponse(success=True, data=ProjectResponse.model_validate(item))


# =====================================================================
# Skill Subcomponent Endpoints
# =====================================================================

@router.post("/{resume_id}/skills", response_model=APIResponse[SkillResponse], status_code=201)
def add_skill(
    resume_id: uuid.UUID,
    obj_in: SkillCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.add_skill(db, resume_id=resume_id, obj_in=obj_in, user_id=current_user.id)
    return APIResponse(success=True, data=SkillResponse.model_validate(item))


@router.put("/{resume_id}/skills/{skill_id}", response_model=APIResponse[SkillResponse])
def update_skill(
    resume_id: uuid.UUID,
    skill_id: uuid.UUID,
    obj_in: SkillUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.update_skill(
        db, resume_id=resume_id, skill_id=skill_id, obj_in=obj_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=SkillResponse.model_validate(item))


@router.delete("/{resume_id}/skills/{skill_id}", response_model=APIResponse[SkillResponse])
def delete_skill(
    resume_id: uuid.UUID,
    skill_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.delete_skill(db, resume_id=resume_id, skill_id=skill_id, user_id=current_user.id)
    return APIResponse(success=True, data=SkillResponse.model_validate(item))


# =====================================================================
# Certificate Subcomponent Endpoints
# =====================================================================

@router.post("/{resume_id}/certificates", response_model=APIResponse[CertificateResponse], status_code=201)
def add_certificate(
    resume_id: uuid.UUID,
    obj_in: CertificateCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.add_certificate(db, resume_id=resume_id, obj_in=obj_in, user_id=current_user.id)
    return APIResponse(success=True, data=CertificateResponse.model_validate(item))


@router.put("/{resume_id}/certificates/{certificate_id}", response_model=APIResponse[CertificateResponse])
def update_certificate(
    resume_id: uuid.UUID,
    certificate_id: uuid.UUID,
    obj_in: CertificateUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.update_certificate(
        db, resume_id=resume_id, certificate_id=certificate_id, obj_in=obj_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=CertificateResponse.model_validate(item))


@router.delete("/{resume_id}/certificates/{certificate_id}", response_model=APIResponse[CertificateResponse])
def delete_certificate(
    resume_id: uuid.UUID,
    certificate_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.delete_certificate(db, resume_id=resume_id, certificate_id=certificate_id, user_id=current_user.id)
    return APIResponse(success=True, data=CertificateResponse.model_validate(item))


# =====================================================================
# Language Subcomponent Endpoints
# =====================================================================

@router.post("/{resume_id}/languages", response_model=APIResponse[LanguageResponse], status_code=201)
def add_language(
    resume_id: uuid.UUID,
    obj_in: LanguageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.add_language(db, resume_id=resume_id, obj_in=obj_in, user_id=current_user.id)
    return APIResponse(success=True, data=LanguageResponse.model_validate(item))


@router.put("/{resume_id}/languages/{language_id}", response_model=APIResponse[LanguageResponse])
def update_language(
    resume_id: uuid.UUID,
    language_id: uuid.UUID,
    obj_in: LanguageUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.update_language(
        db, resume_id=resume_id, language_id=language_id, obj_in=obj_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=LanguageResponse.model_validate(item))


@router.delete("/{resume_id}/languages/{language_id}", response_model=APIResponse[LanguageResponse])
def delete_language(
    resume_id: uuid.UUID,
    language_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.delete_language(db, resume_id=resume_id, language_id=language_id, user_id=current_user.id)
    return APIResponse(success=True, data=LanguageResponse.model_validate(item))


# =====================================================================
# Social Link Subcomponent Endpoints
# =====================================================================

@router.post("/{resume_id}/social-links", response_model=APIResponse[SocialLinkResponse], status_code=201)
def add_social_link(
    resume_id: uuid.UUID,
    obj_in: SocialLinkCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.add_social_link(db, resume_id=resume_id, obj_in=obj_in, user_id=current_user.id)
    return APIResponse(success=True, data=SocialLinkResponse.model_validate(item))


@router.put("/{resume_id}/social-links/{social_link_id}", response_model=APIResponse[SocialLinkResponse])
def update_social_link(
    resume_id: uuid.UUID,
    social_link_id: uuid.UUID,
    obj_in: SocialLinkUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.update_social_link(
        db, resume_id=resume_id, social_link_id=social_link_id, obj_in=obj_in, user_id=current_user.id
    )
    return APIResponse(success=True, data=SocialLinkResponse.model_validate(item))


@router.delete("/{resume_id}/social-links/{social_link_id}", response_model=APIResponse[SocialLinkResponse])
def delete_social_link(
    resume_id: uuid.UUID,
    social_link_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    item = resume_service.delete_social_link(db, resume_id=resume_id, social_link_id=social_link_id, user_id=current_user.id)
    return APIResponse(success=True, data=SocialLinkResponse.model_validate(item))
