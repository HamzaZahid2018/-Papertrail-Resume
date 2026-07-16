import uuid
from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, HttpUrl, Field

# =====================================================================
# Education Schemas
# =====================================================================
class EducationBase(BaseModel):
    institution: str = Field(..., max_length=255)
    degree: Optional[str] = Field(None, max_length=255)
    field_of_study: Optional[str] = Field(None, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    id: Optional[uuid.UUID] = None
    institution: Optional[str] = Field(None, max_length=255)
    degree: Optional[str] = Field(None, max_length=255)
    field_of_study: Optional[str] = Field(None, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None


class EducationResponse(EducationBase):
    id: uuid.UUID
    resume_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Experience Schemas
# =====================================================================
class ExperienceBase(BaseModel):
    company: str = Field(..., max_length=255)
    position: str = Field(..., max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    id: Optional[uuid.UUID] = None
    company: Optional[str] = Field(None, max_length=255)
    position: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None


class ExperienceResponse(ExperienceBase):
    id: uuid.UUID
    resume_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Project Schemas
# =====================================================================
class ProjectBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    role: Optional[str] = Field(None, max_length=255)
    url: Optional[str] = Field(None, max_length=1024)
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    role: Optional[str] = Field(None, max_length=255)
    url: Optional[str] = Field(None, max_length=1024)
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectResponse(ProjectBase):
    id: uuid.UUID
    resume_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Skill Schemas
# =====================================================================
class SkillBase(BaseModel):
    name: str = Field(..., max_length=100)
    level: Optional[str] = Field(None, max_length=50, description="Beginner, Intermediate, Expert, etc.")
    category: Optional[str] = Field(None, max_length=100, description="Frontend, Backend, Soft Skills, etc.")


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = Field(None, max_length=100)
    level: Optional[str] = Field(None, max_length=50)
    category: Optional[str] = Field(None, max_length=100)


class SkillResponse(SkillBase):
    id: uuid.UUID
    resume_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Certificate Schemas
# =====================================================================
class CertificateBase(BaseModel):
    name: str = Field(..., max_length=255)
    issuer: str = Field(..., max_length=255)
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    url: Optional[str] = Field(None, max_length=1024)


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = Field(None, max_length=255)
    issuer: Optional[str] = Field(None, max_length=255)
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    url: Optional[str] = Field(None, max_length=1024)


class CertificateResponse(CertificateBase):
    id: uuid.UUID
    resume_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Language Schemas
# =====================================================================
class LanguageBase(BaseModel):
    name: str = Field(..., max_length=100)
    proficiency: Optional[str] = Field(None, max_length=100, description="Native, Professional, etc.")


class LanguageCreate(LanguageBase):
    pass


class LanguageUpdate(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = Field(None, max_length=100)
    proficiency: Optional[str] = Field(None, max_length=100)


class LanguageResponse(LanguageBase):
    id: uuid.UUID
    resume_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Social Link Schemas
# =====================================================================
class SocialLinkBase(BaseModel):
    platform: str = Field(..., max_length=100, description="GitHub, LinkedIn, Portfolio, etc.")
    url: str = Field(..., max_length=1024)


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(BaseModel):
    id: Optional[uuid.UUID] = None
    platform: Optional[str] = Field(None, max_length=100)
    url: Optional[str] = Field(None, max_length=1024)


class SocialLinkResponse(SocialLinkBase):
    id: uuid.UUID
    resume_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# =====================================================================
# Resume Master Schemas
# =====================================================================
class ResumeBase(BaseModel):
    title: str = Field(..., max_length=255)
    summary: Optional[str] = None


class ResumeCreate(ResumeBase):
    # Optional direct nesting during creation
    educations: Optional[List[EducationCreate]] = None
    experiences: Optional[List[ExperienceCreate]] = None
    projects: Optional[List[ProjectCreate]] = None
    skills: Optional[List[SkillCreate]] = None
    certificates: Optional[List[CertificateCreate]] = None
    languages: Optional[List[LanguageCreate]] = None
    social_links: Optional[List[SocialLinkCreate]] = None


class ResumeUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    summary: Optional[str] = None
    
    # We will handle subcomponent updates via specific endpoints,
    # but also support inline array updates as standard utility options
    educations: Optional[List[EducationUpdate]] = None
    experiences: Optional[List[ExperienceUpdate]] = None
    projects: Optional[List[ProjectUpdate]] = None
    skills: Optional[List[SkillUpdate]] = None
    certificates: Optional[List[CertificateUpdate]] = None
    languages: Optional[List[LanguageUpdate]] = None
    social_links: Optional[List[SocialLinkUpdate]] = None


class ResumeResponse(ResumeBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    # Nested components mapped from SQLAlchemy
    educations: List[EducationResponse] = []
    experiences: List[ExperienceResponse] = []
    projects: List[ProjectResponse] = []
    skills: List[SkillResponse] = []
    certificates: List[CertificateResponse] = []
    languages: List[LanguageResponse] = []
    social_links: List[SocialLinkResponse] = []

    class Config:
        from_attributes = True
