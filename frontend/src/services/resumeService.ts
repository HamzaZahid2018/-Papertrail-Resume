import { apiClient } from "./apiClient.ts";

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  role?: string;
  url?: string;
  start_date?: string;
  end_date?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: string;
  category?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  summary?: string;
  created_at: string;
  updated_at: string;
  completionPercentage?: number; // UI computed strength
  template?: string; // UI mapped meta
  educations: Education[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  languages: Language[];
  social_links: SocialLink[];
}

export interface ResumeCreate {
  title: string;
  summary?: string;
  template?: string;
  educations?: Education[];
  experiences?: Experience[];
  projects?: Project[];
  skills?: Skill[];
  certificates?: Certificate[];
  languages?: Language[];
  social_links?: SocialLink[];
}

export interface ResumeUpdate {
  title?: string;
  summary?: string;
  template?: string;
}

export interface PaginatedMeta {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedResumes {
  items: Resume[];
  meta: PaginatedMeta;
}

export const resumeService = {
  listResumes: async (page = 1, limit = 10, search = ""): Promise<PaginatedResumes> => {
    return apiClient.get("/resumes", {
      params: { page, limit, search: search || undefined },
    });
  },

  getResume: async (id: string): Promise<Resume> => {
    return apiClient.get(`/resumes/${id}`);
  },

  createResume: async (data: ResumeCreate): Promise<Resume> => {
    return apiClient.post("/resumes", data);
  },

  updateResume: async (id: string, data: ResumeUpdate): Promise<Resume> => {
    return apiClient.put(`/resumes/${id}`, data);
  },

  deleteResume: async (id: string): Promise<Resume> => {
    return apiClient.delete(`/resumes/${id}`);
  },
};
