import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, LogOut, Menu, X, ChevronRight, User, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Shared Papertrail Brand Mark (matches landing page)
const BrandMark = () => (
  <div className="relative w-8 h-8 bg-[#1E3A34] rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
    <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#D9A441] rounded-tr-sm" />
    <span className="font-serif text-lg font-bold text-[#FBFAF5] leading-none mt-0.5">P</span>
  </div>
);

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: "Overview", path: "/dashboard", icon: Home, label: "WORKSPACE" },
    { name: "Resume Builder", path: "/builder", icon: FileText, label: "TOOLS" },
    { name: "ATS Checker", path: "/ats-check", icon: Zap, label: "TOOLS" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get user initials for avatar
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "PT";

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: "var(--paper)", backgroundImage: "radial-gradient(rgba(30,58,52,0.035) 1px, transparent 1px)", backgroundSize: "4px 4px" }}>

      {/* ── Mobile Top Header ── */}
      <header className="md:hidden border-b border-[#C9D3C6] px-5 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: "rgba(239,243,236,0.9)" }}>
        <Link to="/" className="flex items-center space-x-2.5">
          <BrandMark />
          <span className="font-mono text-sm font-bold tracking-widest text-[#1E3A34] uppercase">Papertrail</span>
        </Link>
        <button
          className="p-2 text-[#3E5750] hover:bg-[#E4EAE0] rounded-xl transition-colors"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile Backdrop ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#1E3A34]/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-[#C9D3C6] transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `} style={{ backgroundColor: "var(--card)" }}>

        {/* Sidebar Logo */}
        <div className="px-6 py-5 border-b border-[#C9D3C6] hidden md:flex items-center space-x-3">
          <BrandMark />
          <div>
            <span className="font-mono text-sm font-bold tracking-widest text-[#1E3A34] uppercase block leading-none">Papertrail</span>
            <span className="font-mono text-[9px] text-[#5B6B60] uppercase tracking-wider">Resume Builder</span>
          </div>
        </div>

        {/* User Profile Block */}
        <div className="p-5 border-b border-[#C9D3C6]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#1E3A34] flex items-center justify-center text-[#F1D9A5] font-mono text-xs font-bold shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-bold text-[#1E3A34] truncate">{user?.email || "user@papertrail.io"}</p>
              <span className="font-mono text-[9px] text-[#B23A52] uppercase tracking-widest font-bold">Active Account</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group
                  ${isActive
                    ? "bg-[#1E3A34] text-[#FBFAF5] shadow-sm"
                    : "text-[#3E5750] hover:bg-[#E4EAE0] hover:text-[#1E3A34]"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#D9A441]" : "text-[#5B6B60] group-hover:text-[#2C5F5B]"}`} />
                  <span className="font-mono uppercase tracking-wider text-[10px]">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D9A441]" />}
              </Link>
            );
          })}
        </nav>

        {/* Back to Landing Page link */}
        <div className="p-4 border-t border-[#C9D3C6] space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-[#5B6B60] hover:bg-[#E4EAE0] hover:text-[#1E3A34] transition-colors group"
          >
            <Home className="w-4 h-4 flex-shrink-0 group-hover:text-[#2C5F5B]" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Landing Page</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-[#B23A52] hover:bg-[#B23A52]/10 transition-colors group"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Sign Out</span>
          </button>
        </div>

      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-grow overflow-auto">
        <div className="min-h-full">
          {/* Top bar for desktop */}
          <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-[#C9D3C6] sticky top-0 z-30 backdrop-blur-md" style={{ backgroundColor: "rgba(239,243,236,0.9)" }}>
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-[#5B6B60] uppercase tracking-widest">
              <span>Workspace</span>
              <span className="text-[#C9D3C6]">/</span>
              <span className="text-[#1E3A34]">
                {location.pathname === "/dashboard" ? "Overview" : location.pathname === "/builder" ? "Resume Builder" : "ATS Checker"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-[#E4EAE0] border border-[#C9D3C6] px-3 py-1.5 rounded-xl">
                <User className="w-3.5 h-3.5 text-[#2C5F5B]" />
                <span className="font-mono text-[10px] text-[#3E5750] font-bold uppercase tracking-wider">{user?.email?.split("@")[0] || "user"}</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
