import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles, Loader2, AlertCircle, Check, HelpCircle, Layers, ArrowRight, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { DashboardLayout } from "./components/DashboardLayout.tsx";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";

const Dashboard = React.lazy(() => import("./pages/Dashboard.tsx").then(m => ({ default: m.Dashboard })));
const Builder = React.lazy(() => import("./pages/Builder.tsx").then(m => ({ default: m.Builder })));
const AtsChecker = React.lazy(() => import("./pages/AtsChecker.tsx").then(m => ({ default: m.AtsChecker })));

type TemplateDesign = {
  id: string;
  number: string;
  name: string;
  label: string;
  accent: string;
  preview: "classic" | "editorial" | "minimal" | "sidebar" | "timeline" | "portfolio" | "compact";
};

const templateDesigns: TemplateDesign[] = [
  { id: "classic-corporate", number: "01", name: "Classic Corporate", label: "Recent favorite", accent: "#2C5F5B", preview: "classic" },
  { id: "editorial-script", number: "02", name: "Editorial Script", label: "Creative teams", accent: "#B23A52", preview: "editorial" },
  { id: "minimal-clean", number: "03", name: "Minimalist Clean", label: "Fast apply", accent: "#D9A441", preview: "minimal" },
  { id: "sidebar-ledger", number: "04", name: "Sidebar Ledger", label: "Ops and finance", accent: "#1E3A34", preview: "sidebar" },
  { id: "timeline-pro", number: "05", name: "Timeline Pro", label: "Senior roles", accent: "#2C5F5B", preview: "timeline" },
  { id: "portfolio-grid", number: "06", name: "Portfolio Grid", label: "Product and design", accent: "#B23A52", preview: "portfolio" },
  { id: "compact-exec", number: "07", name: "Compact Executive", label: "One page", accent: "#D9A441", preview: "compact" },
];

const ResumeMiniPreview: React.FC<{ design: TemplateDesign }> = ({ design }) => {
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="font-mono-plex text-[6px] sm:text-[7px] uppercase tracking-[0.22em] font-bold" style={{ color: design.accent }}>
      {children}
    </span>
  );

  if (design.preview === "editorial") {
    return (
      <div className="h-56 rounded-xl border border-[#C9D3C6] bg-[#FBFAF5] p-3 sm:p-4 shadow-inner overflow-hidden">
        <div className="border-b border-[#C9D3C6] pb-2 sm:pb-3 mb-2 sm:mb-3">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div>
              <div className="font-fraunces text-base sm:text-lg leading-none text-[#1E3A34]">Nora Bennett</div>
              <div className="font-mono-plex text-[7px] sm:text-[8px] uppercase tracking-[0.22em] mt-1" style={{ color: design.accent }}>Brand Strategist</div>
            </div>
            <div className="text-right font-mono-plex text-[6px] sm:text-[7px] text-[#5B6B60] uppercase tracking-wider">
              <div>London</div>
              <div>nora.studio</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1.3fr_0.8fr] gap-2 sm:gap-3 h-[calc(100%-3.2rem)] sm:h-[calc(100%-3.5rem)]">
          <div className="space-y-2 sm:space-y-3">
            <div>
              <SectionLabel>Profile</SectionLabel>
              <p className="mt-0.5 sm:mt-1 text-[7px] sm:text-[8px] leading-relaxed text-[#3E5750]">Editorial thinker shaping positioning, launches, and multi-channel campaigns.</p>
            </div>
            <div>
              <SectionLabel>Experience</SectionLabel>
              <div className="mt-1 sm:mt-1.5 space-y-1.5 sm:space-y-2">
                <div>
                  <div className="flex justify-between text-[7px] sm:text-[8px] font-semibold text-[#1E3A34]">
                    <span>Studio North</span>
                    <span className="text-[#5B6B60] font-normal">2023</span>
                  </div>
                  <div className="text-[6px] sm:text-[7px] text-[#5B6B60]">Campaign systems and launch playbooks</div>
                </div>
                <div className="h-[1px] bg-[#C9D3C6]" />
                <div>
                  <div className="flex justify-between text-[7px] sm:text-[8px] font-semibold text-[#1E3A34]">
                    <span>Atelier One</span>
                    <span className="text-[#5B6B60] font-normal">2021</span>
                  </div>
                  <div className="text-[6px] sm:text-[7px] text-[#5B6B60]">Narrative direction for luxury brands</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#EFF3EC] rounded-lg p-2 sm:p-2.5 space-y-1.5 sm:space-y-2 border border-[#C9D3C6]">
            <div>
              <SectionLabel>Skills</SectionLabel>
              <div className="mt-0.5 sm:mt-1 flex flex-wrap gap-0.5 sm:gap-1">
                {["Messaging", "Launch", "Copy"].map((item) => (
                  <span key={item} className="px-1 sm:px-1.5 py-0.5 rounded bg-white text-[5px] sm:text-[6px] font-semibold text-[#1E3A34] border border-[#C9D3C6]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Awards</SectionLabel>
              <div className="mt-0.5 sm:mt-1 text-[6px] sm:text-[7px] text-[#5B6B60] leading-relaxed">D&AD shortlist<br />Webby Honoree</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (design.preview === "minimal") {
    return (
      <div className="h-56 rounded-xl border border-[#C9D3C6] bg-[#FBFAF5] p-3 sm:p-4 overflow-hidden">
        <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[#C9D3C6]">
          <div>
            <div className="font-fraunces text-base sm:text-lg leading-none text-[#1E3A34]">Avery Khan</div>
            <div className="font-mono-plex text-[7px] sm:text-[8px] uppercase tracking-[0.24em] mt-1 text-[#5B6B60]">Product Analyst</div>
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2" style={{ borderColor: design.accent }} />
        </div>
        <div className="pt-2 sm:pt-3 space-y-2 sm:space-y-3">
          <div>
            <SectionLabel>Summary</SectionLabel>
            <p className="mt-0.5 sm:mt-1 text-[7px] sm:text-[8px] leading-relaxed text-[#3E5750]">Metrics-focused operator translating messy data into simple hiring stories.</p>
          </div>
          <div>
            <SectionLabel>Recent Work</SectionLabel>
            <div className="mt-1 sm:mt-1.5 space-y-1.5 sm:space-y-2">
              {["Activation reporting", "Funnel optimization", "Forecast modeling"].map((item, index) => (
                <div key={item} className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full text-[5px] sm:text-[6px] flex items-center justify-center font-bold text-[#1E3A34]" style={{ backgroundColor: index === 1 ? "#F1D9A5" : "#EFF3EC" }}>
                    {index + 1}
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-[#5B6B60]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-0.5 sm:pt-1">
            {["SQL", "Looker", "A/B Tests"].map((item) => (
              <div key={item} className="rounded-md border border-[#C9D3C6] bg-[#EFF3EC] py-0.5 sm:py-1 text-center text-[5px] sm:text-[6px] font-semibold text-[#1E3A34]">{item}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (design.preview === "sidebar") {
    return (
      <div className="h-56 rounded-xl border border-[#C9D3C6] bg-[#FBFAF5] overflow-hidden grid grid-cols-[0.85fr_1.15fr] sm:grid-cols-[0.78fr_1.22fr]">
        <div className="bg-[#1E3A34] text-[#FBFAF5] p-2.5 sm:p-3 space-y-2.5 sm:space-y-3">
          <div>
            <div className="font-fraunces text-sm sm:text-base leading-none">Mila Torres</div>
            <div className="font-mono-plex text-[6px] sm:text-[7px] uppercase tracking-[0.24em] mt-1 text-[#F1D9A5]">Finance Lead</div>
          </div>
          <div>
            <div className="font-mono-plex text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-[#F1D9A5]">Contact</div>
            <div className="mt-0.5 sm:mt-1 text-[6px] sm:text-[7px] leading-relaxed text-[#E4EAE0] truncate">mila@ledger.co<br />New York</div>
          </div>
          <div>
            <div className="font-mono-plex text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-[#F1D9A5]">Tools</div>
            <div className="mt-0.5 sm:mt-1 flex flex-wrap gap-0.5 sm:gap-1">
              {["FP&A", "SQL", "ERP"].map((item) => (
                <span key={item} className="bg-[#2C5F5B] px-1 sm:px-1.5 py-0.5 rounded text-[5px] sm:text-[6px] font-semibold">{item}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
          <div>
            <SectionLabel>Profile</SectionLabel>
            <p className="mt-0.5 sm:mt-1 text-[7px] sm:text-[8px] leading-relaxed text-[#3E5750]">Budgeting and reporting partner for scaling teams across operations and planning.</p>
          </div>
          <div>
            <SectionLabel>Experience</SectionLabel>
            <div className="mt-1 sm:mt-1.5 space-y-1.5 sm:space-y-2">
              <div>
                <div className="text-[7px] sm:text-[8px] font-bold text-[#1E3A34] leading-tight">Northline Capital</div>
                <div className="text-[6px] sm:text-[7px] text-[#5B6B60] leading-snug">Built quarterly planning packs and KPI reviews</div>
              </div>
              <div>
                <div className="text-[7px] sm:text-[8px] font-bold text-[#1E3A34] leading-tight">Atlas Energy</div>
                <div className="text-[6px] sm:text-[7px] text-[#5B6B60] leading-snug">Owned expense controls and board summaries</div>
              </div>
            </div>
          </div>
          <div className="h-[1px] bg-[#C9D3C6]" />
          <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[6px] sm:text-[7px] text-[#5B6B60]">
            <div><div className="font-semibold text-[#1E3A34]">MBA</div><div>Wharton</div></div>
            <div><div className="font-semibold text-[#1E3A34]">CPA</div><div>Active</div></div>
          </div>
        </div>
      </div>
    );
  }

  if (design.preview === "timeline") {
    return (
      <div className="h-56 rounded-xl border border-[#C9D3C6] bg-[#FBFAF5] p-3 sm:p-4 overflow-hidden">
        <div className="pb-2 sm:pb-3 border-b border-[#C9D3C6]">
          <div className="font-fraunces text-base sm:text-lg leading-none text-[#1E3A34]">Jonas Reed</div>
          <div className="font-mono-plex text-[7px] sm:text-[8px] uppercase tracking-[0.24em] mt-1" style={{ color: design.accent }}>Engineering Director</div>
        </div>
        <div className="pt-2 sm:pt-3 space-y-2 sm:space-y-3">
          <SectionLabel>Career Timeline</SectionLabel>
          <div className="relative ml-1 sm:ml-2 border-l border-[#C9D3C6] pl-3 sm:pl-4 space-y-2 sm:space-y-3">
            {[
              ["2026", "Scaled platform team to 18 engineers"],
              ["2024", "Shipped hiring system redesign"],
              ["2021", "Led migration to event architecture"],
            ].map(([year, text], index) => (
              <div key={year} className="relative">
                <span className="absolute -left-[0.9rem] sm:-left-[1.15rem] top-1 w-2.5 h-2.5 rounded-full border-2 bg-[#FBFAF5]" style={{ borderColor: index === 0 ? design.accent : "#C9D3C6" }} />
                <div className="text-[6px] sm:text-[7px] font-mono-plex font-bold uppercase tracking-wider" style={{ color: design.accent }}>{year}</div>
                <div className="text-[7px] sm:text-[8px] text-[#3E5750] leading-relaxed">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (design.preview === "portfolio") {
    return (
      <div className="h-56 rounded-xl border border-[#C9D3C6] bg-[#FBFAF5] p-3 sm:p-4 overflow-hidden">
        <div className="flex justify-between items-start gap-2 sm:gap-4 pb-2 sm:pb-3 border-b border-[#C9D3C6]">
          <div>
            <div className="font-fraunces text-base sm:text-lg leading-none text-[#1E3A34]">Sana Malik</div>
            <div className="font-mono-plex text-[7px] sm:text-[8px] uppercase tracking-[0.24em] mt-1 text-[#5B6B60]">Product Designer</div>
          </div>
          <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[5px] sm:text-[6px] font-mono-plex font-bold uppercase tracking-wider text-white" style={{ backgroundColor: design.accent }}>
            Featured work
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 sm:pt-3">
          {[
            ["Design System", "#EFF3EC"],
            ["Mobile Checkout", "#F1D9A5"],
            ["Hiring Portal", "#E4EAE0"],
            ["Case Study", "#F5E9EA"],
          ].map(([title, bg]) => (
            <div key={title} className="rounded-lg border border-[#C9D3C6] p-1.5 sm:p-2" style={{ backgroundColor: bg }}>
              <div className="h-7 sm:h-10 rounded-md bg-white/80 border border-[#C9D3C6]" />
              <div className="mt-1 sm:mt-2 text-[6px] sm:text-[7px] font-semibold text-[#1E3A34] truncate">{title}</div>
              <div className="text-[5px] sm:text-[6px] text-[#5B6B60] truncate">Prototype, metrics, rollout</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (design.preview === "compact") {
    return (
      <div className="h-56 rounded-xl border border-[#C9D3C6] bg-[#FBFAF5] p-3 sm:p-4 overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b-2" style={{ borderColor: design.accent }}>
          <div>
            <div className="font-fraunces text-base sm:text-lg leading-none text-[#1E3A34]">Elena Frost</div>
            <div className="font-mono-plex text-[7px] sm:text-[8px] uppercase tracking-[0.22em] mt-1 text-[#5B6B60]">Chief of Staff</div>
          </div>
          <div className="text-[6px] sm:text-[7px] font-mono-plex uppercase tracking-widest text-[#5B6B60]">1 page</div>
        </div>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-2 sm:gap-3 pt-2 sm:pt-3">
          <div className="space-y-2 sm:space-y-3">
            <div>
              <SectionLabel>Highlights</SectionLabel>
              <ul className="mt-0.5 sm:mt-1 space-y-0.5 text-[6px] sm:text-[7px] text-[#3E5750] list-disc list-inside">
                <li className="truncate">Led annual planning across functions</li>
                <li className="truncate">Built board memo templates</li>
                <li className="truncate">Reduced ops turnaround by 31%</li>
              </ul>
            </div>
            <div>
              <SectionLabel>Experience</SectionLabel>
              <div className="mt-0.5 sm:mt-1 text-[7px] sm:text-[8px] font-semibold text-[#1E3A34] truncate">Orbit Health</div>
              <div className="text-[6px] sm:text-[7px] text-[#5B6B60] truncate">Chief of Staff to COO</div>
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="rounded-lg border border-[#C9D3C6] bg-[#EFF3EC] p-1.5 sm:p-2">
              <div className="text-[5px] sm:text-[6px] font-mono-plex uppercase tracking-wider text-[#5B6B60]">Core</div>
              <div className="mt-0.5 sm:mt-1 text-[6px] sm:text-[7px] font-semibold text-[#1E3A34] truncate">Planning, Comms, Rec</div>
            </div>
            <div className="rounded-lg border border-[#C9D3C6] bg-[#EFF3EC] p-1.5 sm:p-2">
              <div className="text-[5px] sm:text-[6px] font-mono-plex uppercase tracking-wider text-[#5B6B60]">Education</div>
              <div className="mt-0.5 sm:mt-1 text-[6px] sm:text-[7px] font-semibold text-[#1E3A34] truncate">Georgetown</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-56 rounded-xl border border-[#C9D3C6] bg-[#FBFAF5] p-3 sm:p-4 shadow-inner overflow-hidden">
      <div className="border-b border-[#C9D3C6] pb-2 sm:pb-3">
        <div className="font-fraunces text-base sm:text-lg leading-none text-[#1E3A34]">Ethan Cole</div>
        <div className="font-mono-plex text-[7px] sm:text-[8px] uppercase tracking-[0.24em] mt-1" style={{ color: design.accent }}>Senior Product Manager</div>
        <div className="mt-1 text-[6px] sm:text-[7px] text-[#5B6B60] font-mono-plex truncate">ethan.pm | Seattle | linkedin.com/in/ethan</div>
      </div>
      <div className="pt-2 sm:pt-3 space-y-2 sm:space-y-3">
        <div>
          <SectionLabel>Summary</SectionLabel>
          <p className="mt-0.5 sm:mt-1 text-[7px] sm:text-[8px] leading-relaxed text-[#3E5750]">Product operator focused on hiring workflows, growth systems, and clear communication.</p>
        </div>
        <div>
          <SectionLabel>Experience</SectionLabel>
          <div className="mt-1 sm:mt-1.5 space-y-1.5 sm:space-y-2">
            <div>
              <div className="flex justify-between text-[7px] sm:text-[8px] font-semibold text-[#1E3A34]">
                <span>Northstar Labs</span>
                <span className="text-[#5B6B60] font-normal">2022-Pres</span>
              </div>
              <div className="text-[6px] sm:text-[7px] text-[#5B6B60]">Owned roadmap for recruiter workflow automation</div>
            </div>
            <div>
              <div className="flex justify-between text-[7px] sm:text-[8px] font-semibold text-[#1E3A34]">
                <span>Mode Studio</span>
                <span className="text-[#5B6B60] font-normal">2019-22</span>
              </div>
              <div className="text-[6px] sm:text-[7px] text-[#5B6B60]">Launched self-serve dashboards for hiring teams</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-0.5 sm:gap-1 pt-0.5 sm:pt-1">
          {["Roadmaps", "Research", "SQL", "Hiring"].map((item) => (
            <span key={item} className="rounded-full border border-[#C9D3C6] bg-[#EFF3EC] px-1 sm:px-1.5 py-0.5 text-[5px] sm:text-[6px] font-semibold text-[#1E3A34]">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Protected route wrapper enforcing authenticated sessions
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF3EC]">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Brand Mark component (rounded square ink-colored with gold corner-bracket accent)
const BrandMark = () => (
  <div className="relative w-8 h-8 bg-[#1E3A34] rounded-lg flex items-center justify-center shadow-sm">
    <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#D9A441] rounded-tr-sm" />
    <span className="font-fraunces text-lg font-bold text-[#FBFAF5] leading-none mt-0.5">P</span>
  </div>
);

// Landing Page Header navigation
const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#C9D3C6] bg-[#EFF3EC]/85 backdrop-blur-md">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <BrandMark />
          <span className="font-mono-plex text-xs sm:text-sm font-bold tracking-widest text-[#1E3A34] uppercase">
            Papertrail
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-xs font-bold font-mono-plex tracking-wider uppercase">
          <a href="#features" className="text-[#3E5750] hover:text-[#1E3A34] nav-link-underline transition-colors py-1">Features</a>
          <a href="#templates" className="text-[#3E5750] hover:text-[#1E3A34] nav-link-underline transition-colors py-1">Templates</a>
          <Link to="/ats-check" className="text-[#3E5750] hover:text-[#1E3A34] nav-link-underline transition-colors py-1">ATS Check</Link>
          <a href="#how-it-works" className="text-[#3E5750] hover:text-[#1E3A34] nav-link-underline transition-colors py-1">How it works</a>
        </div>
        <div className="flex items-center space-x-5">
          <div className="hidden md:flex items-center space-x-5">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-berry font-mono-plex text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl font-bold">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="font-mono-plex text-xs uppercase tracking-wider font-bold text-[#3E5750] hover:text-[#1E3A34] transition-colors">
                  Sign In
                </Link>
                <Link to="/login" className="btn-berry font-mono-plex text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl font-bold">
                  Start your resume
                </Link>
              </>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#3E5750] hover:bg-[#E4EAE0] rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col bg-[#EFF3EC] pt-20 px-6 space-y-6 animate-fade-in">
          <div className="flex flex-col space-y-4 text-sm font-bold font-mono-plex tracking-wider uppercase">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-[#3E5750] hover:text-[#1E3A34] border-b border-[#C9D3C6] py-3"
            >
              Features
            </a>
            <a
              href="#templates"
              onClick={() => setIsOpen(false)}
              className="text-[#3E5750] hover:text-[#1E3A34] border-b border-[#C9D3C6] py-3"
            >
              Templates
            </a>
            <Link
              to="/ats-check"
              onClick={() => setIsOpen(false)}
              className="text-[#3E5750] hover:text-[#1E3A34] border-b border-[#C9D3C6] py-3"
            >
              ATS Check
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="text-[#3E5750] hover:text-[#1E3A34] border-b border-[#C9D3C6] py-3"
            >
              How it works
            </a>
          </div>
          <div className="flex flex-col space-y-3 pt-6">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="btn-berry text-center font-mono-plex text-xs uppercase tracking-wider py-3.5 rounded-xl font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="font-mono-plex text-center text-xs uppercase tracking-wider font-bold text-[#3E5750] py-3 border border-[#C9D3C6] rounded-xl hover:bg-[#E4EAE0] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-berry text-center font-mono-plex text-xs uppercase tracking-wider py-3.5 rounded-xl font-bold"
                >
                  Start your resume
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-[#C9D3C6] py-8 sm:py-12 px-4 sm:px-6 bg-[#E4EAE0] text-[#1E3A34] mt-auto">
      <div className="max-w-[1180px] mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
        <div className="col-span-2 sm:col-span-2 lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-3">
            <BrandMark />
            <span className="font-mono-plex text-sm font-bold tracking-widest uppercase">Papertrail</span>
          </Link>
          <p className="text-xs text-[#3E5750] leading-relaxed max-w-sm">
            A premium structured resume compiler generating clean, ATS-compliant formats with professional stationery aesthetics.
          </p>
        </div>

        <div>
          <h4 className="font-mono-plex text-xs font-bold uppercase text-[#B23A52] tracking-wider mb-3 sm:mb-4">Product</h4>
          <ul className="space-y-2 text-xs font-semibold text-[#3E5750]">
            <li><a href="#" className="hover:text-[#1E3A34]">Resume Builder</a></li>
            <li><a href="#" className="hover:text-[#1E3A34]">ATS Scoring</a></li>
            <li><a href="#" className="hover:text-[#1E3A34]">Templates</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono-plex text-xs font-bold uppercase text-[#B23A52] tracking-wider mb-3 sm:mb-4">Account</h4>
          <ul className="space-y-2 text-xs font-semibold text-[#3E5750]">
            <li><Link to="/login" className="hover:text-[#1E3A34]">Sign In</Link></li>
            <li><Link to="/login" className="hover:text-[#1E3A34]">Create Account</Link></li>
          </ul>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <h4 className="font-mono-plex text-xs font-bold uppercase text-[#B23A52] tracking-wider mb-3 sm:mb-4">Info</h4>
          <ul className="space-y-2 text-xs font-semibold text-[#3E5750]">
            <li><a href="#" className="hover:text-[#1E3A34]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#1E3A34]">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#1E3A34]">Support Desk</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto border-t border-[#C9D3C6]/60 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <span className="font-mono-plex text-[9px] sm:text-[10px] text-[#5B6B60] uppercase tracking-wider">
          &copy; 2026 PAPERTRAIL. All rights reserved.
        </span>
        <span className="font-mono-plex text-[9px] sm:text-[10px] text-[#5B6B60] uppercase tracking-wider">
          BUILT WITH REACT · FASTAPI · SUPABASE
        </span>
      </div>
    </footer>
  );
};

const Home = () => {
  // Intersection Observer setup for ATS gauge ring fill animation
  const [gaugeVisible, setGaugeVisible] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [visibleTemplates, setVisibleTemplates] = useState(3);
  const gaugeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGaugeVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (gaugeSectionRef.current) {
      observer.observe(gaugeSectionRef.current);
    }

    return () => {
      if (gaugeSectionRef.current) {
        observer.unobserve(gaugeSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const syncVisibleTemplates = () => {
      if (window.innerWidth < 768) {
        setVisibleTemplates(1);
      } else if (window.innerWidth < 1024) {
        setVisibleTemplates(2);
      } else {
        setVisibleTemplates(3);
      }
    };

    syncVisibleTemplates();
    window.addEventListener("resize", syncVisibleTemplates);

    return () => {
      window.removeEventListener("resize", syncVisibleTemplates);
    };
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, templateDesigns.length - visibleTemplates);
    if (templateIndex > maxIndex) {
      setTemplateIndex(maxIndex);
    }
  }, [templateIndex, visibleTemplates]);

  const maxTemplateIndex = Math.max(0, templateDesigns.length - visibleTemplates);
  const canMoveBackward = templateIndex > 0;
  const canMoveForward = templateIndex < maxTemplateIndex;

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="max-w-[1180px] mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column info */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-0.5 bg-[#D9A441]" />
            <span className="font-mono-plex text-[10px] font-bold text-[#D9A441] uppercase tracking-widest">
              FIELD 01 / IDENTITY
            </span>
          </div>

          <h1 className="font-fraunces text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A34] tracking-tight leading-[1.08] max-w-xl">
            A resume built for <span className="text-[#B23A52] italic font-normal">the human reader</span>, readable by machines.
          </h1>

          <p className="text-[#3E5750] text-sm md:text-base leading-relaxed max-w-lg">
            Stop pasting content into generic dark mode SaaS containers. Papertrail outputs gorgeous editor-approved layouts styled to represent structured data profiles.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-3">
            <Link to="/login" className="btn-berry font-mono-plex text-xs uppercase tracking-wider px-8 py-3.5 sm:py-4 rounded-xl font-bold text-center">
              Start building
            </Link>
            <a href="#templates" className="btn-ghost-outline font-mono-plex text-xs uppercase tracking-wider px-8 py-3.5 sm:py-4 rounded-xl font-bold text-center">
              View designs
            </a>
          </div>

          {/* Social Proof overlapping dots */}
          <div className="flex items-center space-x-3 pt-6 border-t border-[#C9D3C6]/40 max-w-sm">
            <div className="flex -space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#2C5F5B]" />
              <span className="w-5 h-5 rounded-full bg-[#D9A441]" />
              <span className="w-5 h-5 rounded-full bg-[#B23A52]" />
            </div>
            <span className="font-mono-plex text-[10px] text-[#5B6B60] uppercase tracking-wider font-semibold">
              Designed for professional tiers
            </span>
          </div>
        </div>

        {/* Right Column tilted mockup — hidden on very small screens */}
        <div className="hidden sm:flex lg:col-span-5 relative justify-center py-4 sm:py-8">

          {/* Gold Wax Stamp overlay */}
          <div className="absolute top-0 sm:top-2 right-0 sm:right-1 lg:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-[#D9A441] rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-dashed border-[#EFF3EC]/60 z-30 transform rotate-12 transition-transform duration-300 hover:scale-105 select-none">
            <span className="font-mono-plex text-[8px] sm:text-[10px] font-bold text-[#1E3A34] tracking-widest">ATS</span>
            <span className="font-mono-plex text-[8px] sm:text-[10px] font-bold text-[#1E3A34] tracking-widest -mt-0.5">READY</span>
          </div>

          <div className="relative w-full max-w-[200px] sm:max-w-xs aspect-[3/4]">

            {/* Back Card Document */}
            <div
              className="absolute inset-0 bg-[#E4EAE0] border border-[#C9D3C6] rounded-2xl shadow-sm transform rotate-6 origin-bottom-left transition-transform duration-500 hover:rotate-[8deg]"
              style={{ content: '""' }}
            />

            {/* Front Card Document (Resume Mockup) */}
            <div className="absolute inset-0 bg-[#FBFAF5] border border-[#C9D3C6] rounded-2xl shadow-md p-4 sm:p-6 transform -rotate-3 origin-bottom-right transition-transform duration-500 hover:-rotate-[4deg] flex flex-col justify-between">

              <div className="space-y-3 sm:space-y-4">
                {/* Mock header */}
                <div className="border-b border-[#C9D3C6] pb-2 sm:pb-3 text-center">
                  <span className="font-fraunces text-sm sm:text-base font-bold block leading-none">Alexander Mercer</span>
                  <span className="font-mono-plex text-[7px] sm:text-[8px] text-[#2C5F5B] uppercase tracking-widest font-bold mt-1 sm:mt-1.5 block">Software Architect</span>
                  <div className="flex justify-center space-x-3 text-[6px] sm:text-[7px] font-mono-plex text-[#5B6B60] mt-1 sm:mt-1.5 font-semibold">
                    <span>nyc.dev</span>
                    <span>alex@mercer.io</span>
                  </div>
                </div>

                {/* Mock section experience */}
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="font-mono-plex text-[6px] sm:text-[7px] text-[#B23A52] font-bold uppercase tracking-widest block">Experience</span>
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex justify-between items-center text-[6px] sm:text-[7px] font-bold">
                      <span>Staff Developer at Stripe</span>
                      <span className="text-[#5B6B60] font-normal text-[5px] sm:text-[6px]">2022 — Present</span>
                    </div>
                    {/* Placeholder bars */}
                    <div className="h-1 sm:h-1.5 bg-[#C9D3C6]/40 rounded w-full" />
                    <div className="h-1 sm:h-1.5 bg-[#C9D3C6]/40 rounded w-11/12" />
                  </div>
                </div>

                {/* Mock section education */}
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="font-mono-plex text-[6px] sm:text-[7px] text-[#B23A52] font-bold uppercase tracking-widest block">Education</span>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[6px] sm:text-[7px] font-bold">
                      <span>B.S. Computer Science</span>
                      <span className="text-[#5B6B60] font-normal text-[5px] sm:text-[6px]">Stanford</span>
                    </div>
                    <div className="h-1 sm:h-1.5 bg-[#C9D3C6]/40 rounded w-3/4" />
                  </div>
                </div>
              </div>

              {/* Skills chips */}
              <div className="flex flex-wrap gap-1 mt-3 sm:mt-4">
                {["TypeScript", "Go", "Docker", "SQL"].map((tag) => (
                  <span key={tag} className="bg-[#EFF3EC] border border-[#C9D3C6] px-1 sm:px-1.5 py-0.5 rounded text-[5px] sm:text-[6px] font-semibold text-[#1E3A34]">
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. LEDGER STRIP motiff */}
      <section className="w-full border-t border-b border-[#C9D3C6] bg-[#E4EAE0]/50 py-3 overflow-hidden select-none">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 flex items-center gap-2 sm:gap-0 sm:justify-between text-[8px] sm:text-[9px] font-bold font-mono-plex tracking-widest text-[#1E3A34] overflow-x-auto scrollbar-hide whitespace-nowrap">
          <span className="shrink-0">Personal</span>
          <span className="text-[#C9D3C6] shrink-0">|</span>
          <span className="shrink-0">Experience</span>
          <span className="text-[#C9D3C6] shrink-0">|</span>
          <span className="shrink-0">Education</span>
          <span className="text-[#C9D3C6] shrink-0">|</span>
          <span className="shrink-0">Skills</span>
          <span className="text-[#C9D3C6] shrink-0">|</span>
          <span className="shrink-0">Projects</span>
          <span className="text-[#C9D3C6] shrink-0">|</span>
          <span className="shrink-0">Certifications</span>
        </div>
      </section>

      {/* 3. FEATURES SECTION (Bordered seam effect) */}
      <section id="features" className="max-w-[1180px] mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28 space-y-8 sm:space-y-12">
        <div className="space-y-3 max-w-xl">
          <span className="font-mono-plex text-[10px] font-bold text-[#B23A52] uppercase tracking-widest block">
            WHAT IT DOES
          </span>
          <h2 className="font-fraunces text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E3A34] leading-tight">
            Strict structure, beautiful output.
          </h2>
          <p className="text-[#3E5750] text-sm leading-relaxed">
            No layout drift, no formatting shifts. We separate raw text values from the final render pipeline so you can focus strictly on accomplishments.
          </p>
        </div>

        {/* Feature Grid with border seams (0 gaps) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#C9D3C6] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">

          {/* Card 1 */}
          <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#C9D3C6] hover:bg-[#E4EAE0]/25 transition-colors group">
            <div className="w-10 h-10 bg-[#EFF3EC] text-[#1E3A34] rounded-lg flex items-center justify-center shadow-sm border border-[#C9D3C6] mb-4 sm:mb-6">
              <Layers className="w-5 h-5 text-[#2C5F5B]" />
            </div>
            <span className="font-mono-plex text-[9px] font-bold text-[#B23A52] tracking-widest uppercase block mb-2">FIELD 01 / UPDATE</span>
            <h3 className="font-fraunces text-base sm:text-lg font-bold text-[#1E3A34] mb-2 sm:mb-3">Live as you type</h3>
            <p className="text-xs text-[#5B6B60] leading-relaxed">
              Every stroke updates the print layout preview immediately on a split-screen canvas, keeping layout ratios precise.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#C9D3C6] hover:bg-[#E4EAE0]/25 transition-colors group">
            <div className="w-10 h-10 bg-[#EFF3EC] text-[#1E3A34] rounded-lg flex items-center justify-center shadow-sm border border-[#C9D3C6] mb-4 sm:mb-6">
              <Sparkles className="w-5 h-5 text-[#D9A441]" />
            </div>
            <span className="font-mono-plex text-[9px] font-bold text-[#B23A52] tracking-widest uppercase block mb-2">FIELD 02 / COMPLIANCE</span>
            <h3 className="font-fraunces text-base sm:text-lg font-bold text-[#1E3A34] mb-2 sm:mb-3">Scored against the bots</h3>
            <p className="text-xs text-[#5B6B60] leading-relaxed">
              Live checks verify headings, dates, and keyword density parameters against Applicant Tracking System specs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-8 hover:bg-[#E4EAE0]/25 transition-colors group">
            <div className="w-10 h-10 bg-[#EFF3EC] text-[#1E3A34] rounded-lg flex items-center justify-center shadow-sm border border-[#C9D3C6] mb-4 sm:mb-6">
              <HelpCircle className="w-5 h-5 text-[#B23A52]" />
            </div>
            <span className="font-mono-plex text-[9px] font-bold text-[#B23A52] tracking-widest uppercase block mb-2">FIELD 03 / TEMPLATE</span>
            <h3 className="font-fraunces text-base sm:text-lg font-bold text-[#1E3A34] mb-2 sm:mb-3">Three formats, one dataset</h3>
            <p className="text-xs text-[#5B6B60] leading-relaxed">
              Switch structures with one click without resetting fields. Your resume dataset adjusts to each template dynamically.
            </p>
          </div>

        </div>
      </section>

      {/* 4. TEMPLATES SECTION */}
      <section id="templates" className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28 space-y-8 sm:space-y-12">
        <div className="space-y-3 text-center max-w-xl mx-auto">
          <span className="font-mono-plex text-[10px] font-bold text-[#D9A441] uppercase tracking-widest block">
            FIELD 02 / SHAPE
          </span>
          <h2 className="font-fraunces text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E3A34]">
            Pick a shape for the story.
          </h2>
          <p className="text-[#3E5750] text-sm leading-relaxed">
            Beautifully weighted typography choices curated for different industries. Flat, vector-grade structures.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5">
          <div>
            <div className="font-mono-plex text-[10px] uppercase tracking-[0.24em] text-[#5B6B60] font-bold">
              Recent collection
            </div>
            <p className="text-xs text-[#5B6B60] mt-2 max-w-md leading-relaxed hidden sm:block">
              Browse seven polished resume directions. The carousel keeps the same Papertrail fonts, colors, and editorial style while showing more designs than the old three-card row.
            </p>
          </div>
          <div className="flex items-center gap-3 self-center lg:self-auto">
            <button
              type="button"
              onClick={() => setTemplateIndex((current) => Math.max(0, current - 1))}
              disabled={!canMoveBackward}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C9D3C6] bg-[#FBFAF5] flex items-center justify-center text-[#1E3A34] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#E4EAE0] transition-colors"
              aria-label="Previous designs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setTemplateIndex((current) => Math.min(maxTemplateIndex, current + 1))}
              disabled={!canMoveForward}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C9D3C6] bg-[#FBFAF5] flex items-center justify-center text-[#1E3A34] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#E4EAE0] transition-colors"
              aria-label="Next designs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-full overflow-hidden -mx-2 sm:-mx-3">
          <div
            className="flex transition-transform duration-500 ease-out w-full min-w-0"
            style={{ transform: `translateX(-${templateIndex * (100 / visibleTemplates)}%)` }}
          >
            {templateDesigns.map((design) => (
              <div
                key={design.id}
                className="shrink-0 px-2 sm:px-3 min-w-0"
                style={{ flexBasis: `${100 / visibleTemplates}%` }}
              >
                <div className="bg-[#FBFAF5] border border-[#C9D3C6] rounded-2xl sm:rounded-[1.75rem] p-3 sm:p-5 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                  <ResumeMiniPreview design={design} />
                  <div className="flex justify-between items-start gap-2 sm:gap-3 mt-3 sm:mt-5">
                    <div>
                      <div className="font-fraunces text-sm sm:text-lg font-bold text-[#1E3A34] group-hover:text-[#B23A52] transition-colors truncate">
                        {design.name}
                      </div>
                      <div className="font-mono-plex text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[#5B6B60] mt-0.5 sm:mt-1 font-bold">
                        {design.label}
                      </div>
                    </div>
                    <span className="font-mono-plex text-[10px] sm:text-xs text-[#5B6B60] pt-1">{design.number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2 pt-1">
          {Array.from({ length: maxTemplateIndex + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setTemplateIndex(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all ${index === templateIndex ? "w-6 sm:w-8 bg-[#B23A52]" : "w-2 sm:w-2.5 bg-[#C9D3C6]"}`}
              aria-label={`Go to template group ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 5. ATS COMPATIBILITY SECTION (Dark contrast forest green panel) */}
      <section id="ats-check" className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div
          ref={gaugeSectionRef}
          className="bg-[#1E3A34] text-[#FBFAF5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left info column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="font-mono-plex text-[10px] font-bold text-[#F1D9A5] uppercase tracking-widest block">
              ATS AUDIT SPECIFICATION
            </span>

            <h2 className="font-fraunces text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FBFAF5] leading-tight max-w-lg">
              Checklisted for applicant scanners.
            </h2>

            <p className="text-[#C9D3C6] text-xs sm:text-sm leading-relaxed max-w-md">
              Scanners read stream text directly. We bypass custom text frames and fancy table borders that break parser engines.
            </p>

            {/* Grid Checklists */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-semibold font-mono-plex tracking-wide text-[#EFF3EC] pt-2 sm:pt-4">
              <li className="flex items-center space-x-3">
                <span className="w-5 h-5 bg-[#D9A441] text-[#1E3A34] rounded-full flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 stroke-[3]" /></span>
                <span>Standard headers</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-5 h-5 bg-[#D9A441] text-[#1E3A34] rounded-full flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 stroke-[3]" /></span>
                <span>Machine dates</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-5 h-5 bg-[#D9A441] text-[#1E3A34] rounded-full flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 stroke-[3]" /></span>
                <span>No breaking grids</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-5 h-5 bg-[#D9A441] text-[#1E3A34] rounded-full flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 stroke-[3]" /></span>
                <span>Keywords density</span>
              </li>
            </ul>
          </div>

          {/* Right SVG circular gauge column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 py-4 sm:py-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center bg-[#2C5F5B]/30 rounded-full border border-[#2C5F5B]/50">

              {/* Circular Gauge Ring SVG */}
              <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  className="stroke-[#2C5F5B]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  className="stroke-[#D9A441] transition-all duration-[1400ms] ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={314}
                  strokeDashoffset={gaugeVisible ? 314 * (1 - 92 / 100) : 314}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-fraunces text-2xl sm:text-3xl font-extrabold text-[#FBFAF5] leading-none">92%</span>
                <span className="font-mono-plex text-[6px] sm:text-[7px] text-[#C9D3C6] uppercase tracking-widest font-bold mt-1 sm:mt-1.5">Compliance</span>
              </div>
            </div>

            <span className="font-mono-plex text-[8px] sm:text-[9px] font-bold text-[#F1D9A5] uppercase tracking-widest text-center">
              Standard ATS compatibility score
            </span>
          </div>

        </div>
      </section>

      {/* 6. CTA PANEL */}
      <section id="how-it-works" className="max-w-[1180px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="bg-gradient-to-r from-[#B23A52] to-[#8C2C40] text-[#FBFAF5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-16 text-center space-y-4 sm:space-y-6 relative overflow-hidden shadow-lg border border-[#8C2C40]/35">

          {/* Dashed circle decoration background */}
          <div className="absolute -top-10 -right-10 w-32 sm:w-48 h-32 sm:h-48 border-2 border-dashed border-[#FBFAF5]/10 rounded-full pointer-events-none" />

          <h2 className="font-fraunces text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#FBFAF5] max-w-2xl mx-auto leading-tight relative z-10">
            Ready to put it on paper?
          </h2>

          <p className="text-[#FBFAF5]/80 text-xs sm:text-sm max-w-md mx-auto leading-relaxed relative z-10 font-medium">
            Join thousands of professional developers and business specialists compiling pristine CV databases today.
          </p>

          <div className="pt-2 sm:pt-4 relative z-10">
            <Link to="/login" className="btn-gold font-mono-plex text-xs uppercase tracking-wider px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold inline-flex items-center space-x-2">
              <span>Create my layout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

const BuilderWrapper = () => (
  <div className="max-w-[1180px] mx-auto px-6 py-6 animate-fade-in">
    <Builder />
  </div>
);

const Login = () => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Toggle between "signin" and "signup" modes
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, setIsPending] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setErrorMsg("");
    setSuccessMsg("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
    }

    setIsPending(true);
    try {
      if (mode === "signin") {
        await login(email, password);
        navigate("/dashboard");
      } else {
        await register(email, password);
        setSuccessMsg("Account created! You can now sign in.");
        switchMode("signin");
      }
    } catch (err: any) {
      setErrorMsg(err.message || (mode === "signin" ? "Invalid credentials." : "Registration failed. Try a different email."));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-fade-in">
      <div className="bg-[#FBFAF5] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#C9D3C6] shadow-sm">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
          <BrandMark />
          <h2 className="font-fraunces text-2xl font-bold text-[#1E3A34] mt-4">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-xs text-[#5B6B60] mt-1 font-mono-plex">
            {mode === "signin" ? "Sign in to your Papertrail workspace" : "Start building your resume today"}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-[#E4EAE0] rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold font-mono-plex uppercase tracking-wider transition-all duration-200 ${mode === "signin"
                ? "bg-[#FBFAF5] text-[#1E3A34] shadow-sm"
                : "text-[#5B6B60] hover:text-[#1E3A34]"
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold font-mono-plex uppercase tracking-wider transition-all duration-200 ${mode === "signup"
                ? "bg-[#FBFAF5] text-[#1E3A34] shadow-sm"
                : "text-[#5B6B60] hover:text-[#1E3A34]"
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Success messages */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-4 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-[#EFF3EC] border border-[#C9D3C6] text-[#2C5F5B] px-4 py-3 rounded-xl mb-4 text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name — only shown on signup */}
          {mode === "signup" && (
            <div>
              <label className="text-xs font-semibold text-[#3E5750] block mb-1 font-mono-plex uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="Alex Mercer"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#C9D3C6] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] bg-[#FBFAF5] transition-all text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#3E5750] block mb-1 font-mono-plex uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#C9D3C6] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] bg-[#FBFAF5] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#3E5750] block mb-1 font-mono-plex uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#C9D3C6] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] bg-[#FBFAF5] transition-all text-sm"
              required
            />
          </div>

          {/* Confirm Password — only shown on signup */}
          {mode === "signup" && (
            <div>
              <label className="text-xs font-semibold text-[#3E5750] block mb-1 font-mono-plex uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#C9D3C6] focus:outline-none focus:ring-2 focus:ring-[#2C5F5B]/20 focus:border-[#2C5F5B] bg-[#FBFAF5] transition-all text-sm"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full btn-berry font-mono-plex text-xs uppercase tracking-wider py-3.5 rounded-xl font-bold flex items-center justify-center mt-2"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Switch mode text link */}
        <p className="text-center text-xs text-[#5B6B60] mt-6">
          {mode === "signin" ? (
            <>Don't have an account?{" "}
              <button onClick={() => switchMode("signup")} className="text-[#B23A52] font-bold hover:underline">
                Sign Up
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => switchMode("signin")} className="text-[#B23A52] font-bold hover:underline">
                Sign In
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
};


function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing & Authentication pages */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col bg-[#EFF3EC]">
                <Navigation />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/login" element={
              <div className="min-h-screen flex flex-col bg-[#EFF3EC]">
                <Navigation />
                <main className="flex-grow">
                  <Login />
                </main>
                <Footer />
              </div>
            } />

            {/* Dashboard & Workspace views */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <React.Suspense fallback={
                    <div className="min-h-[50vh] flex items-center justify-center bg-[#EFF3EC]">
                      <Loader2 className="w-8 h-8 text-[#1E3A34] animate-spin" />
                    </div>
                  }>
                    <Dashboard />
                  </React.Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/builder" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <React.Suspense fallback={
                    <div className="min-h-[50vh] flex items-center justify-center bg-[#EFF3EC]">
                      <Loader2 className="w-8 h-8 text-[#1E3A34] animate-spin" />
                    </div>
                  }>
                    <BuilderWrapper />
                  </React.Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/ats-check" element={
              <ProtectedRoute>
                <React.Suspense fallback={
                  <div className="min-h-[50vh] flex items-center justify-center bg-[#EFF3EC]">
                    <Loader2 className="w-8 h-8 text-[#1E3A34] animate-spin" />
                  </div>
                }>
                  <AtsChecker />
                </React.Suspense>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
