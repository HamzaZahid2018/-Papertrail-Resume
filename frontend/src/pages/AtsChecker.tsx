import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Loader2, Sparkles, AlertCircle, TrendingUp, ChevronRight, RotateCw } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { checkAts, AtsCheckResponse } from "../services/ats";

export const AtsChecker = () => {
  const { addToast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AtsCheckResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx')) {
      addToast("Please upload a PDF or DOCX file.", "error");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      addToast("File size must be under 5MB.", "error");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      addToast("Please upload a resume.", "error");
      return;
    }
    if (!jobDescription.trim()) {
      addToast("Please provide a job description.", "error");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const data = await checkAts(file, jobDescription);
      setResult(data);
      addToast("Analysis complete!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to analyze resume.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#2C5F5B] stroke-[#2C5F5B]";
    if (score >= 60) return "text-[#D9A441] stroke-[#D9A441]";
    return "text-[#B23A52] stroke-[#B23A52]";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-[#EFF3EC]";
    if (score >= 60) return "bg-[#FBF7EE]";
    return "bg-[#F5E9EA]";
  };

  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return "border-[#2C5F5B]/20";
    if (score >= 60) return "border-[#D9A441]/20";
    return "border-[#B23A52]/20";
  };

  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <DashboardLayout>
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.3; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.8; }
        }
        .animate-scan {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, transparent, #2C5F5B, transparent);
          box-shadow: 0 0 10px #2C5F5B, 0 0 4px #2C5F5B;
          animation: scan 2.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl font-bold text-[#1E3A34] mb-2">ATS Resume Checker</h1>
            <p className="text-[#3E5750] text-sm max-w-2xl">
              Upload your resume and the target job description. Our AI will analyze your resume against ATS algorithms to provide actionable feedback.
            </p>
          </div>
          {result && (
            <button
              onClick={() => {
                setFile(null);
                setJobDescription("");
                setResult(null);
              }}
              className="btn-ghost-outline self-start md:self-auto font-mono-plex text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-lg font-bold flex items-center"
            >
              <RotateCw className="w-3.5 h-3.5 mr-2" />
              Reset Checker
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">

          {/* Upload Section */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FBFAF5] border border-[#C9D3C6] rounded-xl p-6 shadow-sm">
              <h2 className="font-mono-plex text-xs font-bold text-[#1E3A34] uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>1. Upload Resume</span>
                {file && <span className="bg-[#2C5F5B]/10 text-[#2C5F5B] px-2 py-0.5 rounded text-[10px] font-mono-plex font-bold uppercase">Loaded</span>}
              </h2>

              <div
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${isDragging
                    ? "border-[#2C5F5B] bg-[#E4EAE0] scale-[0.99] shadow-inner"
                    : "border-[#C9D3C6] bg-white hover:bg-[#E4EAE0]/25 hover:border-[#2C5F5B]/70"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />

                {file ? (
                  <>
                    <FileText className="w-12 h-12 text-[#2C5F5B] mb-3 animate-pulse-slow" />
                    <p className="font-semibold text-[#1E3A34] text-sm truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-[#5B6B60] mt-1 font-mono-plex">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <span className="text-[10px] text-[#2C5F5B] font-bold underline mt-2">Change file</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-[#5B6B60] mb-3 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-[#1E3A34] text-sm">Drag & drop your resume here</p>
                    <p className="text-xs text-[#5B6B60] mt-1">Supports PDF & DOCX (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-[#FBFAF5] border border-[#C9D3C6] rounded-xl p-6 shadow-sm flex flex-col">
              <h2 className="font-mono-plex text-xs font-bold text-[#1E3A34] uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>2. Job Description</span>
                {jobDescription.trim() && <span className="bg-[#D9A441]/15 text-[#D9A441] px-2 py-0.5 rounded text-[10px] font-mono-plex font-bold uppercase">Ready</span>}
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full h-48 bg-white border border-[#C9D3C6] rounded-xl p-4 text-sm text-[#1E3A34] placeholder-[#5B6B60] focus:ring-2 focus:ring-[#2C5F5B] focus:border-transparent resize-none focus:outline-none transition-all shadow-inner"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !file || !jobDescription.trim()}
              className="w-full btn-berry font-mono-plex text-xs uppercase tracking-wider py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 bg-[#FBFAF5] border border-[#C9D3C6] rounded-xl p-6 flex flex-col min-h-[500px] shadow-sm">
            <h2 className="font-mono-plex text-xs font-bold text-[#1E3A34] uppercase tracking-wider mb-6 flex items-center justify-between">
              <span>Analysis Results</span>
              {result && <span className="bg-[#2C5F5B]/15 text-[#2C5F5B] px-2.5 py-0.5 rounded-full text-[10px] font-mono-plex font-bold uppercase">Evaluated</span>}
            </h2>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-[#5B6B60]">
                <div className="relative w-20 h-24 mb-6 border-2 border-[#C9D3C6] rounded-lg bg-white p-4 overflow-hidden flex flex-col justify-between shadow-sm animate-pulse-slow">
                  <div className="animate-scan"></div>
                  <div className="space-y-2">
                    <div className="h-1.5 bg-[#E4EAE0] rounded w-3/4"></div>
                    <div className="h-1.5 bg-[#E4EAE0] rounded w-full"></div>
                    <div className="h-1.5 bg-[#E4EAE0] rounded w-5/6"></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-[#E4EAE0] rounded w-full"></div>
                    <div className="h-1.5 bg-[#E4EAE0] rounded w-2/3"></div>
                  </div>
                </div>
                <p className="font-mono-plex text-xs font-bold uppercase tracking-widest text-[#1E3A34] animate-pulse">
                  AI evaluating resume contents...
                </p>
                <p className="text-xs text-[#5B6B60] mt-2 max-w-xs text-center leading-relaxed">
                  Comparing skills, formatting styles, and keywords against the target job profile.
                </p>
              </div>
            ) : result ? (
              <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[620px] pr-2 custom-scrollbar">

                {/* Premium Score Dashboard */}
                <div className={`flex items-center space-x-6 p-5 border ${getScoreBorderColor(result.score)} rounded-xl bg-white shadow-sm`}>
                  <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background circle track */}
                      <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className="stroke-[#EFF3EC]"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      {/* Interactive gauge fill */}
                      <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        className={`transition-all duration-[1500ms] ease-out ${getScoreColor(result.score)}`}
                        strokeWidth="7"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (result.score / 100) * circumference}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className={`absolute inset-1.5 rounded-full flex items-center justify-center ${getScoreBgColor(result.score)}`}>
                      <span className="font-fraunces text-3xl font-extrabold text-[#1E3A34]">{result.score}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-fraunces text-lg font-bold text-[#1E3A34] flex items-center">
                      ATS Match Score
                      <span className={`ml-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-plex uppercase font-bold tracking-wider ${result.score >= 80
                          ? "bg-[#2C5F5B]/10 text-[#2C5F5B]"
                          : result.score >= 60
                            ? "bg-[#D9A441]/10 text-[#D9A441]"
                            : "bg-[#B23A52]/10 text-[#B23A52]"
                        }`}>
                        {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Average" : "Needs Review"}
                      </span>
                    </h3>
                    <p className="text-xs text-[#5B6B60] mt-1.5 leading-relaxed">
                      This score represents the keyword compatibility index and syntactic formatting align with scanner engines.
                    </p>
                  </div>
                </div>

                {/* Keywords Analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Matched Keywords */}
                  <div className="border border-[#C9D3C6] rounded-xl p-5 bg-white shadow-sm flex flex-col">
                    <h4 className="flex items-center font-mono-plex text-[10px] font-bold text-[#2C5F5B] uppercase tracking-wider mb-4">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Matched Keywords ({result.matched_keywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 flex-grow content-start">
                      {result.matched_keywords.length > 0 ? result.matched_keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center space-x-1 bg-[#EFF3EC] text-[#2C5F5B] px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#C9D3C6]/20 hover:scale-105 transition-all duration-200"
                        >
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                          <span>{kw}</span>
                        </span>
                      )) : <span className="text-xs text-[#5B6B60] italic">None identified.</span>}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="border border-[#C9D3C6] rounded-xl p-5 bg-white shadow-sm flex flex-col">
                    <h4 className="flex items-center font-mono-plex text-[10px] font-bold text-[#B23A52] uppercase tracking-wider mb-4">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Missing Keywords ({result.missing_keywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 flex-grow content-start">
                      {result.missing_keywords.length > 0 ? result.missing_keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center space-x-1 bg-[#F5E9EA] text-[#B23A52] px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#B23A52]/10 hover:scale-105 transition-all duration-200"
                        >
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{kw}</span>
                        </span>
                      )) : (
                        <span className="inline-flex items-center space-x-1.5 text-xs text-[#2C5F5B] font-semibold bg-[#EFF3EC] p-2 rounded-xl">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>All core keywords found!</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggestions Card */}
                <div className="border border-[#C9D3C6] rounded-xl p-5 bg-white shadow-sm">
                  <h4 className="flex items-center font-mono-plex text-[10px] font-bold text-[#D9A441] uppercase tracking-wider mb-4">
                    <TrendingUp className="w-4 h-4 mr-2" /> Actionable Recommendations
                  </h4>
                  {result.suggestions.length > 0 ? (
                    <ul className="space-y-2.5">
                      {result.suggestions.map((sug, i) => (
                        <li key={i} className="flex items-start text-xs text-[#3E5750] bg-[#FBFAF5] p-3 rounded-lg border border-[#C9D3C6]/30 hover:border-[#D9A441]/50 hover:bg-white transition-all duration-200">
                          <ChevronRight className="w-4 h-4 text-[#D9A441] mt-0.5 mr-2.5 flex-shrink-0" />
                          <span className="leading-relaxed font-semibold">{sug}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#5B6B60] italic">No recommendations required. Excellent work!</p>
                  )}
                </div>

                {/* Formatting Card */}
                <div className="border border-[#C9D3C6] rounded-xl p-5 bg-white shadow-sm">
                  <h4 className="flex items-center font-mono-plex text-[10px] font-bold text-[#1E3A34] uppercase tracking-wider mb-4">
                    <FileText className="w-4 h-4 mr-2" /> Formatting & Syntactic Audit
                  </h4>
                  {result.formatting_issues.length > 0 ? (
                    <ul className="space-y-2.5">
                      {result.formatting_issues.map((issue, i) => (
                        <li key={i} className="flex items-start text-xs text-[#3E5750] bg-[#FBFAF5] p-3 rounded-lg border border-[#C9D3C6]/30 hover:border-[#B23A52]/50 hover:bg-white transition-all duration-200">
                          <AlertCircle className="w-4 h-4 text-[#B23A52] mt-0.5 mr-2.5 flex-shrink-0" />
                          <span className="leading-relaxed font-semibold">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center p-3 border border-[#2C5F5B]/10 bg-[#EFF3EC]/30 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#2C5F5B] mr-2" />
                      <span className="text-xs font-semibold text-[#2C5F5B]">No formatting structural issues detected.</span>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#5B6B60] text-center p-8 border-2 border-dashed border-[#C9D3C6]/60 rounded-xl bg-white/40 animate-pulse-slow">
                <div className="w-16 h-16 rounded-full bg-[#E4EAE0]/30 border border-[#C9D3C6]/40 flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-[#5B6B60] opacity-45" />
                </div>
                <p className="font-mono-plex text-xs font-bold uppercase tracking-wider text-[#1E3A34]">No analysis generated yet</p>
                <p className="text-xs mt-2 text-[#5B6B60] max-w-xs leading-relaxed">
                  Provide your resume and job description on the left, then click the evaluation button to run scan tests.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
