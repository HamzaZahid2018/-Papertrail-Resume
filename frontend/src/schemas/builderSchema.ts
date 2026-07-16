import { z } from "zod";

export const personalSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  github: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  linkedin: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(2, "Institution name is required"),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position/Title is required"),
  location: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Project name is required"),
  description: z.string().optional(),
  role: z.string().optional(),
  url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  level: z.string().optional(), // e.g. Beginner, Expert
  category: z.string().optional(), // e.g. Frontend, Backend
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Certificate name is required"),
  issuer: z.string().min(2, "Issuer is required"),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const builderSchema = z.object({
  personal: personalSchema,
  summary: z.string().optional(),
  educations: z.array(educationSchema).default([]),
  experiences: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
});

export type BuilderFormValues = z.infer<typeof builderSchema>;
export type PersonalFormValues = z.infer<typeof personalSchema>;
export type EducationFormValues = z.infer<typeof educationSchema>;
export type ExperienceFormValues = z.infer<typeof experienceSchema>;
export type ProjectFormValues = z.infer<typeof projectSchema>;
export type SkillFormValues = z.infer<typeof skillSchema>;
export type CertificateFormValues = z.infer<typeof certificateSchema>;
