import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import {
  User, FileText, GraduationCap, Briefcase, Code, Award,
  ChevronLeft, ChevronRight, Plus, Trash2, Save, CheckCircle,
  Loader2, Download
} from "lucide-react";
import { builderSchema, BuilderFormValues } from "../schemas/builderSchema.ts";
import { ResumePreview } from "../components/ResumePreview.tsx";
import { useToast } from "../context/ToastContext.tsx";
import { resumeService } from "../services/resumeService.ts";

const STEPS = [
  { id: 0, name: "Personal",     icon: User },
  { id: 1, name: "Summary",      icon: FileText },
  { id: 2, name: "Education",    icon: GraduationCap },
  { id: 3, name: "Experience",   icon: Briefcase },
  { id: 4, name: "Projects",     icon: Code },
  { id: 5, name: "Skills",       icon: Code },
  { id: 6, name: "Certificates", icon: Award },
];

// Shared label style
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#5B6B60] block mb-1.5">
    {children}
  </label>
);

// Shared themed input
const Field = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ label, error, ...props }, ref) => (
    <div>
      {label && <Label>{label}</Label>}
      <input
        ref={ref}
        {...props}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1E3A34] placeholder-[#5B6B60]/60 bg-[#EFF3EC] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] transition-all ${
          error ? "border-[#B23A52]" : "border-[#C9D3C6]"
        } ${props.className || ""}`}
      />
      {error && <p className="text-[10px] text-[#B23A52] font-mono mt-1">{error}</p>}
    </div>
  )
);

// Shared themed textarea
const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }>(
  ({ label, ...props }, ref) => (
    <div>
      {label && <Label>{label}</Label>}
      <textarea
        ref={ref}
        {...props}
        className={`w-full px-4 py-3 rounded-xl border border-[#C9D3C6] text-sm text-[#1E3A34] placeholder-[#5B6B60]/60 bg-[#EFF3EC] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] transition-all resize-none ${props.className || ""}`}
      />
    </div>
  )
);

export const Builder = () => {
  const { addToast } = useToast();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  const [showPreview, setShowPreview] = useState(false); // mobile toggle
  const [isPersisting, setIsPersisting] = useState(false);

  const loadInitialValues = (): BuilderFormValues => {
    const saved = localStorage.getItem("resume_draft");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      personal: { fullName: "", email: "", phone: "", location: "", website: "", github: "", linkedin: "" },
      summary: "",
      educations: [],
      experiences: [],
      projects: [],
      skills: [],
      certificates: [],
    };
  };

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<BuilderFormValues>({
    resolver: zodResolver(builderSchema),
    defaultValues: loadInitialValues(),
  });

  const formValues = watch();
  const serializedFormValues = JSON.stringify(formValues);
  const activeResumeMeta = (() => {
    const stateMeta = location.state as { resumeId?: string; title?: string; template?: string } | null;
    if (stateMeta?.resumeId) {
      return {
        id: stateMeta.resumeId,
        title: stateMeta.title || "Untitled Resume",
        template: stateMeta.template || "Classic Corporate",
      };
    }

    const savedMeta = localStorage.getItem("active_resume_meta");
    if (!savedMeta) {
      return null;
    }

    try {
      return JSON.parse(savedMeta) as { id: string; title: string; template: string };
    } catch {
      return null;
    }
  })();

  const { fields: educationFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "educations" });
  const { fields: experienceFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experiences" });
  const { fields: projectFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });
  const { fields: certificateFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certificates" });

  // Autosave to localStorage every 2s after last change
  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      localStorage.setItem("resume_draft", serializedFormValues);
      setSaveStatus("saved");
    }, 2000);
    return () => clearTimeout(timer);
  }, [serializedFormValues]);

  const onSubmit = (data: BuilderFormValues) => {
    localStorage.setItem("resume_draft", JSON.stringify(data));
    setSaveStatus("saved");
    addToast("Resume draft saved successfully!", "success");
  };

  // Fix: Save works by calling handleSubmit on any step
  const handleSave = async () => {
    try {
      setIsPersisting(true);
      localStorage.setItem("resume_draft", serializedFormValues);

      const payload = {
        title: activeResumeMeta?.title || (formValues.personal.fullName ? `${formValues.personal.fullName} Resume` : "Untitled Resume"),
        summary: formValues.summary || "",
        template: activeResumeMeta?.template || "Classic Corporate",
      };

      const persistedResume = activeResumeMeta?.id
        ? await resumeService.updateResume(activeResumeMeta.id, payload)
        : await resumeService.createResume(payload);

      localStorage.setItem("active_resume_meta", JSON.stringify({
        id: persistedResume.id,
        title: persistedResume.title,
        template: persistedResume.template || payload.template,
      }));

      setSaveStatus("saved");
      addToast("Resume saved to your records successfully!", "success");
    } catch (error: any) {
      addToast(error?.message || "Could not save resume to records.", "error");
    } finally {
      setIsPersisting(false);
    }
  };

  // Fix: PDF download — triggers browser print targeting #resume-preview-print
  const handleDownloadPDF = () => {
    const previewNode = document.getElementById("resume-preview-print");
    if (!previewNode) {
      addToast("Resume preview is not available yet.", "error");
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join("\n");

    const documentHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${formValues.personal.fullName || "Papertrail Resume"}</title>
          ${styles}
          <style>
            body {
              margin: 0;
              padding: 12mm;
              background: white;
            }

            #resume-preview-print {
              width: 210mm !important;
              min-height: auto !important;
              margin: 0 auto !important;
              padding: 12mm !important;
              box-sizing: border-box !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              overflow: visible !important;
              max-height: none !important;
            }
          </style>
        </head>
        <body>
          ${previewNode.outerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([documentHtml], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = (formValues.personal.fullName || "papertrail-resume")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    link.href = url;
    link.download = `${fileName || "papertrail-resume"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast("Resume downloaded successfully.", "success");
  };

  const entryCardCls = "p-5 border border-[#C9D3C6] rounded-2xl space-y-4 bg-[#EFF3EC]/40 relative";
  const addBtnCls = "w-full py-2.5 border-2 border-dashed border-[#C9D3C6] rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest text-[#5B6B60] hover:border-[#2C5F5B] hover:text-[#2C5F5B] hover:bg-[#EFF3EC] transition-all flex items-center justify-center space-x-2";
  const removeBtnCls = "absolute top-4 right-4 p-1.5 text-[#5B6B60] hover:text-[#B23A52] hover:bg-[#B23A52]/10 rounded-lg transition-colors";
  const entryHeadCls = "font-mono text-[9px] font-bold uppercase tracking-widest text-[#B23A52]";
  const isLastStep = currentStep === STEPS.length - 1;

  const handleAdvanceOrSave = () => {
    if (isLastStep) {
      void handleSave();
      return;
    }

    setCurrentStep((step) => Math.min(STEPS.length - 1, step + 1));
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">

      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#B23A52] uppercase tracking-widest block mb-1">TOOLS / RESUME BUILDER</span>
          <h1 className="font-serif text-2xl font-extrabold text-[#1E3A34]">Build Your Resume</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Autosave status indicator */}
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            {saveStatus === "saving" ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin text-[#5B6B60]" /><span className="text-[#5B6B60]">Saving...</span></>
            ) : (
              <><CheckCircle className="w-3.5 h-3.5 text-[#2C5F5B]" /><span className="text-[#2C5F5B]">Saved</span></>
            )}
          </span>
          <button onClick={handleDownloadPDF} className="btn-ghost-outline font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl font-bold flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button onClick={handleSave} className="btn-berry font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl font-bold flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save CV</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Preview Toggle ── */}
      <div className="flex lg:hidden mb-4 border border-[#C9D3C6] rounded-xl overflow-hidden">
        <button
          onClick={() => setShowPreview(false)}
          className={`flex-1 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${!showPreview ? "bg-[#1E3A34] text-[#FBFAF5]" : "text-[#5B6B60] bg-[#FBFAF5]"}`}
        >Edit Fields</button>
        <button
          onClick={() => setShowPreview(true)}
          className={`flex-1 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${showPreview ? "bg-[#1E3A34] text-[#FBFAF5]" : "text-[#5B6B60] bg-[#FBFAF5]"}`}
        >Live Preview</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[70vh] lg:min-h-[78vh]">

        {/* ── Left: Form Panel ── */}
        <div className={`w-full lg:w-[58%] flex flex-col bg-[#FBFAF5] border border-[#C9D3C6] rounded-2xl p-6 shadow-sm ${showPreview ? "hidden lg:flex" : "flex"}`}>

          {/* Step header */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-[#5B6B60] uppercase tracking-widest">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>

            {/* Stepper pills */}
            <div className="flex gap-1.5">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  title={step.name}
                  className={`h-1.5 flex-grow rounded-full transition-all duration-300 ${currentStep >= step.id ? "bg-[#2C5F5B]" : "bg-[#C9D3C6]"}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2.5">
              {React.createElement(STEPS[currentStep].icon, { className: "w-5 h-5 text-[#D9A441]" })}
              <h2 className="font-serif text-xl font-bold text-[#1E3A34]">{STEPS[currentStep].name}</h2>
            </div>
          </div>

          {/* Step fields */}
          <div className="flex-1 overflow-y-auto pr-1 pb-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* STEP 0: PERSONAL */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <Field label="Full Name" placeholder="e.g. John Doe" {...register("personal.fullName")} error={errors.personal?.fullName?.message} />
                  <Field label="Email Address" type="email" placeholder="e.g. john@example.com" {...register("personal.email")} error={errors.personal?.email?.message} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone" placeholder="e.g. +1 555-0199" {...register("personal.phone")} />
                    <Field label="Location" placeholder="e.g. New York, NY" {...register("personal.location")} />
                  </div>
                  <Field label="Portfolio / Website" placeholder="e.g. https://johndoe.dev" {...register("personal.website")} error={errors.personal?.website?.message} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="GitHub URL" placeholder="https://github.com/john" {...register("personal.github")} error={errors.personal?.github?.message} />
                    <Field label="LinkedIn URL" placeholder="https://linkedin.com/in/john" {...register("personal.linkedin")} error={errors.personal?.linkedin?.message} />
                  </div>
                </div>
              )}

              {/* STEP 1: SUMMARY */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <TextArea label="Professional Summary" placeholder="Summarize your professional profile, key skills, and career goals..." {...register("summary")} rows={8} />
                </div>
              )}

              {/* STEP 2: EDUCATION */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  {educationFields.map((field, i) => (
                    <div key={field.id} className={entryCardCls}>
                      <button type="button" onClick={() => removeEdu(i)} className={removeBtnCls}><Trash2 className="w-4 h-4" /></button>
                      <span className={entryHeadCls}>Education #{i + 1}</span>
                      <Field label="Institution" placeholder="e.g. Stanford University" {...register(`educations.${i}.institution`)} error={errors.educations?.[i]?.institution?.message} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Degree" placeholder="e.g. B.Sc." {...register(`educations.${i}.degree`)} />
                        <Field label="Field of Study" placeholder="e.g. Computer Science" {...register(`educations.${i}.field_of_study`)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" placeholder="e.g. Sep 2020" {...register(`educations.${i}.start_date`)} />
                        <Field label="End Date" placeholder="e.g. May 2024" {...register(`educations.${i}.end_date`)} />
                      </div>
                    </div>
                  ))}
                  <button type="button" className={addBtnCls} onClick={() => appendEdu({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "" })}>
                    <Plus className="w-4 h-4" /><span>Add Education Entry</span>
                  </button>
                </div>
              )}

              {/* STEP 3: EXPERIENCE */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  {experienceFields.map((field, i) => (
                    <div key={field.id} className={entryCardCls}>
                      <button type="button" onClick={() => removeExp(i)} className={removeBtnCls}><Trash2 className="w-4 h-4" /></button>
                      <span className={entryHeadCls}>Experience #{i + 1}</span>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Job Title / Position" placeholder="e.g. Senior Developer" {...register(`experiences.${i}.position`)} error={errors.experiences?.[i]?.position?.message} />
                        <Field label="Company" placeholder="e.g. Stripe" {...register(`experiences.${i}.company`)} error={errors.experiences?.[i]?.company?.message} />
                      </div>
                      <Field label="Location" placeholder="e.g. San Francisco, CA" {...register(`experiences.${i}.location`)} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" placeholder="e.g. Jan 2022" {...register(`experiences.${i}.start_date`)} />
                        <Field label="End Date" placeholder="Leave blank if current" {...register(`experiences.${i}.end_date`)} />
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <input type="checkbox" id={`current-${i}`} {...register(`experiences.${i}.is_current`)} className="accent-[#2C5F5B]" />
                        <label htmlFor={`current-${i}`} className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5B6B60]">Currently working here</label>
                      </div>
                      <TextArea label="Description / Responsibilities" placeholder="Describe your main contributions and accomplishments..." {...register(`experiences.${i}.description`)} rows={4} />
                    </div>
                  ))}
                  <button type="button" className={addBtnCls} onClick={() => appendExp({ company: "", position: "", location: "", start_date: "", end_date: "", is_current: false, description: "" })}>
                    <Plus className="w-4 h-4" /><span>Add Experience Entry</span>
                  </button>
                </div>
              )}

              {/* STEP 4: PROJECTS */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  {projectFields.map((field, i) => (
                    <div key={field.id} className={entryCardCls}>
                      <button type="button" onClick={() => removeProj(i)} className={removeBtnCls}><Trash2 className="w-4 h-4" /></button>
                      <span className={entryHeadCls}>Project #{i + 1}</span>
                      <Field label="Project Name" placeholder="e.g. ResumeForge" {...register(`projects.${i}.name`)} error={errors.projects?.[i]?.name?.message} />
                      <TextArea label="Description" placeholder="What does this project do?" {...register(`projects.${i}.description`)} rows={3} />
                      <Field label="Technologies Used" placeholder="e.g. React, FastAPI, PostgreSQL" {...register(`projects.${i}.role`)} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" placeholder="e.g. Jan 2023" {...register(`projects.${i}.start_date`)} />
                        <Field label="End Date" placeholder="e.g. Mar 2023" {...register(`projects.${i}.end_date`)} />
                      </div>
                      <Field label="Project URL" placeholder="https://github.com/..." {...register(`projects.${i}.url`)} error={errors.projects?.[i]?.url?.message} />
                    </div>
                  ))}
                  <button type="button" className={addBtnCls} onClick={() => appendProj({ name: "", description: "", role: "", start_date: "", end_date: "", url: "" })}>
                    <Plus className="w-4 h-4" /><span>Add Project Entry</span>
                  </button>
                </div>
              )}

              {/* STEP 5: SKILLS */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  {skillFields.map((field, i) => (
                    <div key={field.id} className={entryCardCls}>
                      <button type="button" onClick={() => removeSkill(i)} className={removeBtnCls}><Trash2 className="w-4 h-4" /></button>
                      <span className={entryHeadCls}>Skill #{i + 1}</span>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Skill Name" placeholder="e.g. TypeScript" {...register(`skills.${i}.name`)} error={errors.skills?.[i]?.name?.message} />
                        <div>
                          <Label>Proficiency Level</Label>
                          <select
                            {...register(`skills.${i}.level`)}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#C9D3C6] text-sm text-[#1E3A34] bg-[#EFF3EC] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] transition-all"
                          >
                            <option value="">Select level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" className={addBtnCls} onClick={() => appendSkill({ name: "", level: "Intermediate", category: "" })}>
                    <Plus className="w-4 h-4" /><span>Add Skill</span>
                  </button>
                </div>
              )}

              {/* STEP 6: CERTIFICATES */}
              {currentStep === 6 && (
                <div className="space-y-5">
                  {certificateFields.map((field, i) => (
                    <div key={field.id} className={entryCardCls}>
                      <button type="button" onClick={() => removeCert(i)} className={removeBtnCls}><Trash2 className="w-4 h-4" /></button>
                      <span className={entryHeadCls}>Certificate #{i + 1}</span>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Certificate Name" placeholder="e.g. AWS Solutions Architect" {...register(`certificates.${i}.name`)} error={errors.certificates?.[i]?.name?.message} />
                        <Field label="Issuer" placeholder="e.g. Amazon Web Services" {...register(`certificates.${i}.issuer`)} error={errors.certificates?.[i]?.issuer?.message} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Issue Date" placeholder="e.g. Jun 2023" {...register(`certificates.${i}.issue_date`)} />
                        <Field label="Expiry Date" placeholder="e.g. Jun 2026 (opt.)" {...register(`certificates.${i}.expiry_date`)} />
                      </div>
                      <Field label="Credential URL" placeholder="https://..." {...register(`certificates.${i}.url`)} error={errors.certificates?.[i]?.url?.message} />
                    </div>
                  ))}
                  <button type="button" className={addBtnCls} onClick={() => appendCert({ name: "", issuer: "", issue_date: "", expiry_date: "", url: "" })}>
                    <Plus className="w-4 h-4" /><span>Add Certificate</span>
                  </button>
                </div>
              )}

            </form>
          </div>

          {/* Step nav footer */}
          <div className="flex justify-between items-center border-t border-[#C9D3C6] pt-5 mt-4 gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
              disabled={currentStep === 0}
              className="btn-ghost-outline font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /><span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleAdvanceOrSave}
              disabled={isPersisting}
              className="btn-berry font-mono text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLastStep ? (
                <>
                  {isPersisting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isPersisting ? "Saving..." : "Save Resume"}</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Right: Live Preview Panel ── */}
        <div className={`w-full lg:w-[42%] flex flex-col ${showPreview ? "flex" : "hidden lg:flex"}`}>
          <div className="flex items-center justify-between mb-3 rounded-2xl border border-[#C9D3C6] bg-[#FBFAF5]/80 px-4 py-3 shrink-0">
            <span className="font-mono text-[10px] font-bold text-[#5B6B60] uppercase tracking-widest flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2C5F5B] animate-pulse" />
              <span>Live Preview · ATS Format</span>
            </span>
            <span className="font-mono text-[9px] text-[#5B6B60] italic">Updates as you type</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ResumePreview data={formValues} />
          </div>
        </div>

      </div>
    </div>
  );
};
