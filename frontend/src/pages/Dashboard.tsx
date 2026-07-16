import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  MoreVertical,
  Clock,
  Award,
  Layers,
  ExternalLink,
  Copy,
  Trash2,
  Edit3,
  AlertCircle,
  Check,
  SlidersHorizontal
} from "lucide-react";
import { Modal } from "../components/ui/Modal.tsx";
import {
  useResumesQuery,
  useCreateResumeMutation,
  useDeleteResumeMutation,
  useDuplicateResumeMutation
} from "../hooks/useResumes.ts";
import { Resume } from "../services/resumeService.ts";
import { useToast } from "../context/ToastContext.tsx";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const page = 1;
  const [sortBy, setSortBy] = useState<"updated" | "title" | "completion">("updated");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "complete">("all");

  const { data, isLoading, isError, error } = useResumesQuery(page, 10, searchQuery);

  const createMutation = useCreateResumeMutation();
  const deleteMutation = useDeleteResumeMutation();
  const duplicateMutation = useDuplicateResumeMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTemplate, setNewTemplate] = useState("Classic Corporate");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const persistActiveResumeMeta = (resume: Partial<Resume> & { id: string }) => {
    localStorage.setItem("active_resume_meta", JSON.stringify({
      id: resume.id,
      title: resume.title || "Untitled Resume",
      template: resume.template || "Classic Corporate",
    }));
  };

  const formatUpdateDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleCreateResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createMutation.mutate(
      { title: newTitle, template: newTemplate } as any,
      {
        onSuccess: (createdResume: Resume) => {
          persistActiveResumeMeta(createdResume);
          addToast("Resume created successfully!", "success");
          setNewTitle("");
          setIsCreateOpen(false);
          navigate("/builder", {
            state: {
              resumeId: createdResume.id,
              title: createdResume.title,
              template: createdResume.template || newTemplate,
            }
          });
        },
        onError: (err: any) => {
          addToast(err?.message || "Failed to create resume.", "error");
        }
      }
    );
  };

  const handleDuplicate = (resume: Resume) => {
    duplicateMutation.mutate(resume, {
      onSuccess: () => addToast("Resume duplicated!", "success"),
      onError: (err: any) => addToast(err?.message || "Duplicate failed.", "error")
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => {
        addToast("Resume deleted.", "success");
        setDeleteTargetId(null);
      },
      onError: (err: any) => {
        addToast(err?.message || "Delete failed.", "error");
        setDeleteTargetId(null);
      }
    });
  };

  const getResumeCompletion = (resume: Partial<Resume>) => {
    const sections = [
      Boolean(resume.title?.trim()),
      Boolean(resume.summary?.trim()),
      (resume.educations?.length || 0) > 0,
      (resume.experiences?.length || 0) > 0,
      (resume.projects?.length || 0) > 0,
      (resume.skills?.length || 0) > 0,
      (resume.certificates?.length || 0) > 0,
    ];

    const completedSections = sections.filter(Boolean).length;
    const percent = Math.round((completedSections / sections.length) * 100);
    return Math.min(100, percent);
  };

  const rawItems: Resume[] = data?.items || [];

  const filteredResumes = rawItems
    .filter(r => {
      const strength = getResumeCompletion(r);
      const statusValue = strength >= 100 ? "complete" : r.id.startsWith("temp-id") ? "draft" : "active";
      return statusFilter === "all" || statusValue === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "completion") return (b.completionPercentage || 0) - (a.completionPercentage || 0);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  const totalResumes = rawItems.length;
  const avgCompletion = rawItems.length
    ? Math.round(rawItems.reduce((acc, r) => acc + getResumeCompletion(r), 0) / rawItems.length)
    : 0;
  const templateCount = new Set(rawItems.map(r => r.template || "Classic")).size;

  const statusColors: Record<string, string> = {
    complete: "bg-[#EFF3EC] text-[#2C5F5B] border-[#C9D3C6]",
    active: "bg-[#F1D9A5] text-[#1E3A34] border-[#D9A441]/40",
    draft: "bg-[#E4EAE0] text-[#5B6B60] border-[#C9D3C6]"
  };

  // Skeleton Loader
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#FBFAF5] rounded-2xl border border-[#C9D3C6] p-6 space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-[#E4EAE0] rounded-full" />
            <div className="h-4 w-4 bg-[#E4EAE0] rounded" />
          </div>
          <div className="h-5 w-3/4 bg-[#E4EAE0] rounded" />
          <div className="h-4 w-1/2 bg-[#E4EAE0] rounded" />
          <div className="space-y-2 pt-4">
            <div className="h-2 w-1/4 bg-[#E4EAE0] rounded" />
            <div className="h-2 w-full bg-[#E4EAE0] rounded-full" />
          </div>
          <div className="pt-4 border-t border-[#C9D3C6] flex justify-between">
            <div className="h-3 w-24 bg-[#E4EAE0] rounded" />
            <div className="h-3 w-12 bg-[#E4EAE0] rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#B23A52] uppercase tracking-widest block mb-1">
            WORKSPACE / OVERVIEW
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#1E3A34] tracking-tight leading-tight">
            My Resumes
          </h1>
          <p className="text-[#5B6B60] text-sm mt-1">Manage and publish your professional layouts.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn-berry font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-xl font-bold flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Resume</span>
        </button>
      </div>

      {/* ── Error Banner ── */}
      {isError && (
        <div className="bg-[#FBFAF5] border border-[#B23A52]/30 rounded-2xl p-4 flex items-start space-x-3 text-[#B23A52]">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm font-mono uppercase tracking-wider">Backend connection failed</h4>
            <p className="text-xs mt-1 text-[#8C2C40]">{(error as any)?.message || "Make sure the FastAPI backend server is running on port 8000."}</p>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-[#FBFAF5] border border-[#C9D3C6] rounded-2xl p-6 flex items-center space-x-4 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 bg-[#EFF3EC] border border-[#C9D3C6] rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-[#2C5F5B]" />
          </div>
          <div>
            <span className="font-mono text-[9px] font-bold text-[#5B6B60] uppercase tracking-widest block">Total Resumes</span>
            <span className="font-serif text-3xl font-extrabold text-[#1E3A34] block mt-0.5 leading-none">
              {isLoading ? "—" : totalResumes}
            </span>
          </div>
        </div>

        <div className="bg-[#FBFAF5] border border-[#C9D3C6] rounded-2xl p-6 flex items-center space-x-4 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 bg-[#F1D9A5] border border-[#D9A441]/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-[#1E3A34]" />
          </div>
          <div>
            <span className="font-mono text-[9px] font-bold text-[#5B6B60] uppercase tracking-widest block">Avg Completion</span>
            <span className="font-serif text-3xl font-extrabold text-[#1E3A34] block mt-0.5 leading-none">
              {isLoading ? "—" : `${avgCompletion}%`}
            </span>
          </div>
        </div>

        <div className="bg-[#1E3A34] border border-[#2C5F5B]/40 rounded-2xl p-6 flex items-center space-x-4 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 bg-[#2C5F5B]/40 border border-[#2C5F5B]/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-[#D9A441]" />
          </div>
          <div>
            <span className="font-mono text-[9px] font-bold text-[#C9D3C6] uppercase tracking-widest block">Active Templates</span>
            <span className="font-serif text-3xl font-extrabold text-[#FBFAF5] block mt-0.5 leading-none">
              {isLoading ? "—" : templateCount}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="bg-[#FBFAF5] border border-[#C9D3C6] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">

          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6B60]" />
            <input
              type="text"
              placeholder="Search resumes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EFF3EC] border border-[#C9D3C6] rounded-xl text-sm text-[#1E3A34] placeholder-[#5B6B60] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] transition-all"
              aria-label="Search resumes by title"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2 border border-[#C9D3C6] px-3 py-2.5 rounded-xl bg-[#EFF3EC]">
            <SlidersHorizontal className="w-4 h-4 text-[#5B6B60]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-mono text-xs font-bold text-[#3E5750] focus:outline-none cursor-pointer uppercase tracking-wider"
              aria-label="Sort resumes"
            >
              <option value="updated">Sort: Recently Updated</option>
              <option value="title">Sort: Title A–Z</option>
              <option value="completion">Sort: Completion Rate</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 border-t border-[#C9D3C6] pt-4">
          {(["all", "active", "draft", "complete"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                statusFilter === tab
                  ? "bg-[#1E3A34] text-[#FBFAF5] shadow-sm"
                  : "text-[#5B6B60] hover:bg-[#E4EAE0] hover:text-[#1E3A34]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Resume Cards Grid ── */}
      {isLoading ? (
        renderSkeletons()
      ) : filteredResumes.length === 0 ? (
        // Empty State
        <div className="bg-[#FBFAF5] border border-[#C9D3C6] rounded-3xl py-20 px-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#EFF3EC] border border-[#C9D3C6] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FileText className="w-8 h-8 text-[#5B6B60]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1E3A34]">No resumes found</h3>
          <p className="text-[#5B6B60] text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            Create your first structured layout or adjust your search filters.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-berry font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-xl font-bold mt-6 inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Resume</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => {
            const isTemp = resume.id.startsWith("temp-id");
            const strength = getResumeCompletion(resume);
            const statusValue = strength >= 100 ? "complete" : isTemp ? "draft" : "active";

            return (
              <div
                key={resume.id}
                className={`bg-[#FBFAF5] border border-[#C9D3C6] rounded-2xl p-6 flex flex-col relative group hover:-translate-y-1 hover:shadow-md transition-all duration-200 ${isTemp ? "opacity-60" : ""}`}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColors[statusValue]}`}>
                    {statusValue}
                  </span>

                  {!isTemp && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === resume.id ? null : resume.id);
                        }}
                        className="p-1.5 text-[#5B6B60] hover:text-[#1E3A34] hover:bg-[#E4EAE0] rounded-lg transition-colors"
                        aria-label="Open actions menu"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === resume.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-0 mt-1 w-44 bg-[#FBFAF5] border border-[#C9D3C6] rounded-xl shadow-lg py-1.5 z-20">
                            <button
                              onClick={() => {
                                persistActiveResumeMeta(resume);
                                navigate("/builder", {
                                  state: {
                                    resumeId: resume.id,
                                    title: resume.title,
                                    template: resume.template || "Classic Corporate",
                                  }
                                });
                                setActiveMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 hover:bg-[#E4EAE0] transition-colors flex items-center space-x-2.5 text-xs font-semibold text-[#3E5750] hover:text-[#1E3A34]"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#2C5F5B]" />
                              <span>Edit Resume</span>
                            </button>
                            <button
                              onClick={() => { handleDuplicate(resume); setActiveMenuId(null); }}
                              className="w-full px-4 py-2.5 hover:bg-[#E4EAE0] transition-colors flex items-center space-x-2.5 text-xs font-semibold text-[#3E5750] hover:text-[#1E3A34]"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#2C5F5B]" />
                              <span>Duplicate</span>
                            </button>
                            <hr className="my-1 border-[#C9D3C6]" />
                            <button
                              onClick={() => { setDeleteTargetId(resume.id); setActiveMenuId(null); }}
                              className="w-full px-4 py-2.5 hover:bg-[#B23A52]/10 transition-colors flex items-center space-x-2.5 text-xs font-semibold text-[#B23A52]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <h3 className="font-serif font-bold text-[#1E3A34] text-lg group-hover:text-[#B23A52] transition-colors line-clamp-1">
                  {resume.title}
                </h3>
                <div className="flex items-center space-x-1.5 font-mono text-[10px] text-[#5B6B60] font-semibold uppercase tracking-wider mt-1.5">
                  <Layers className="w-3 h-3" />
                  <span>{resume.template || "Classic Corporate"}</span>
                </div>

                {/* Strength Bar */}
                <div className="mt-5 flex-grow">
                  <div className="flex items-center justify-between font-mono text-[10px] font-bold text-[#5B6B60] uppercase tracking-wider mb-2">
                    <span>Profile Strength</span>
                    <span className={strength >= 80 ? "text-[#2C5F5B]" : "text-[#D9A441]"}>{strength}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E4EAE0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${strength}%`,
                        backgroundColor: strength >= 80 ? "#2C5F5B" : strength >= 50 ? "#D9A441" : "#B23A52"
                      }}
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-[#C9D3C6] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-mono text-[10px] text-[#5B6B60] font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>{formatUpdateDate(resume.updated_at)}</span>
                  </div>
                  {!isTemp && (
                    <button
                      onClick={() => {
                        persistActiveResumeMeta(resume);
                        navigate("/builder", {
                          state: {
                            resumeId: resume.id,
                            title: resume.title,
                            template: resume.template || "Classic Corporate",
                          }
                        });
                      }}
                      className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B23A52] hover:text-[#8C2C40] flex items-center space-x-1 transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create Resume Modal ── */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Resume">
        <form onSubmit={handleCreateResume} className="space-y-5">
          <div>
            <label className="font-mono text-[10px] font-bold text-[#5B6B60] uppercase tracking-widest block mb-1.5">
              Resume Title
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Software Architect CV"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#C9D3C6] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] bg-[#FBFAF5] transition-all text-sm text-[#1E3A34]"
              required
            />
            <p className="text-[10px] text-[#5B6B60] mt-1.5 font-mono">Give your CV a descriptive name indicating your professional tier.</p>
          </div>

          <div>
            <label className="font-mono text-[10px] font-bold text-[#5B6B60] uppercase tracking-widest block mb-2">
              Starting Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Classic Corporate", "Editorial Script", "Minimalist Clean", "ATS Plain"].map((tpl) => (
                <div
                  key={tpl}
                  onClick={() => setNewTemplate(tpl)}
                  className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all select-none ${
                    newTemplate === tpl
                      ? "border-[#2C5F5B] bg-[#EFF3EC] text-[#1E3A34] font-bold"
                      : "border-[#C9D3C6] hover:border-[#2C5F5B]/40 text-[#5B6B60] bg-[#FBFAF5]"
                  }`}
                >
                  {newTemplate === tpl && <Check className="w-3 h-3 text-[#2C5F5B] mx-auto mb-1.5" />}
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{tpl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#C9D3C6] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              disabled={createMutation.isPending}
              className="btn-ghost-outline font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-berry font-mono text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2"
            >
              {createMutation.isPending ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              ) : (
                <span>Create & Open Builder</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={deleteTargetId !== null} onClose={() => setDeleteTargetId(null)} title="Delete Resume">
        <div className="space-y-4">
          <p className="text-sm text-[#5B6B60] leading-relaxed">
            Are you sure you want to permanently delete this resume? This action cannot be undone.
          </p>
          <div className="pt-4 border-t border-[#C9D3C6] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setDeleteTargetId(null)}
              disabled={deleteMutation.isPending}
              className="btn-ghost-outline font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="font-mono text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 text-[#FBFAF5] transition-colors"
              style={{ backgroundColor: "#B23A52", boxShadow: "0 3px 0 #8C2C40" }}
            >
              {deleteMutation.isPending ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              ) : (
                <span>Delete Permanently</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
