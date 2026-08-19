import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  BriefcaseMedical,
  Database,
  FileClock,
  FileText,
  Home,
  Lock,
  MapPinned,
  Menu,
  RadioTower,
  Search,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Users,
  Wifi,
  WifiOff,
  LogOut,
  UserCheck
} from "lucide-react";
import { translate, type Language } from "./i18n";
import type { HumanitarianCase, Role } from "./types";
import { useAuth } from "./components/AuthContext";
import { Login } from "./components/Login";
import { cases } from "./data";

import { AccessDenied, StatusPill, LoadingState } from "./components/Shared";
import { Dashboard } from "./components/Dashboard";
import { CaseList, CaseForm } from "./components/CaseList";
import { CaseDetail } from "./components/CaseDetail";
import { FamilyLinks } from "./components/FamilyLinks";
import { Referrals } from "./components/Referrals";
import { ServicesMap } from "./components/ServicesMap";
import { SecurityCenter, Audit } from "./components/SecurityCenter";
import { PrivacyCenter } from "./components/PrivacyCenter";
import { DataQuality, Offline, AiAssistant, Demo, Settings, Analytics } from "./components/OtherPages";

// Navigation definition
const NAV_ITEMS = [
  { path: "/dashboard", key: "dashboard", icon: Home },
  { path: "/cases", key: "cases", icon: FileText },
  { path: "/family-links", key: "familyLinks", icon: Users },
  { path: "/referrals", key: "referrals", icon: BriefcaseMedical },
  { path: "/services", key: "services", icon: MapPinned },
  { path: "/analytics", key: "analytics", icon: BarChart3 },
  { path: "/data-quality", key: "dataQuality", icon: Database },
  { path: "/security", key: "security", icon: ShieldAlert },
  { path: "/audit-logs", key: "audit", icon: FileClock },
  { path: "/privacy", key: "privacy", icon: Lock },
  { path: "/offline", key: "offline", icon: RadioTower },
  { path: "/ai-assistant", key: "ai", icon: Bot },
  { path: "/demo", key: "demo", icon: Activity },
  { path: "/settings", key: "settings", icon: SlidersHorizontal }
] as const;

// Role-based route access derived directly from docs/rbac-matrix.md
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: NAV_ITEMS.map((item) => item.path),
  PROGRAM_MANAGER: ["/dashboard", "/cases", "/family-links", "/referrals", "/services", "/analytics", "/data-quality", "/audit-logs", "/privacy", "/demo", "/settings"],
  PROTECTION_OFFICER: ["/dashboard", "/cases", "/family-links", "/referrals", "/services", "/offline", "/ai-assistant", "/demo", "/settings"],
  CASE_WORKER: ["/dashboard", "/cases", "/family-links", "/referrals", "/services", "/offline", "/ai-assistant", "/settings"],
  DATA_OFFICER: ["/dashboard", "/cases", "/family-links", "/analytics", "/data-quality", "/ai-assistant", "/settings"],
  FIELD_OFFICER: ["/dashboard", "/cases", "/referrals", "/services", "/offline", "/settings"],
  AUDITOR: ["/dashboard", "/cases", "/family-links", "/security", "/audit-logs", "/privacy", "/settings"],
  VIEWER: ["/dashboard", "/cases", "/services", "/analytics", "/settings"]
};

function currentPath() {
  return window.location.pathname === "/" ? "/dashboard" : window.location.pathname;
}

export function App() {
  const { user, profile, role, loading, signOut } = useAuth();
  const [path, setPath] = useState(currentPath());
  const [language, setLanguage] = useState<Language>("en");
  const [online, setOnline] = useState(navigator.onLine);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localCases, setLocalCases] = useState(cases);
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("popstate", onPop);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <LoadingState message="Verifying session and security credentials..." />
      </div>
    );
  }

  if (!user || !role) {
    return <Login />;
  }

  const allowedPaths = ROLE_PERMISSIONS[role] || ["/dashboard"];
  const isAllowed = allowedPaths.includes(path) || path.startsWith("/cases/");

  function navigate(nextPath: string) {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    setSidebarOpen(false);
  }

  function createDemoCase() {
    const next: HumanitarianCase = {
      id: `HP-2026-${String(500 + localCases.length).padStart(5, "0")}`,
      type: "FAMILY_SEPARATION",
      priority: "HIGH",
      region: "Amhara",
      location: "North Wollo",
      status: online ? "ASSESSMENT" : "NEW",
      assignedOfficer: profile?.fullName || "Unassigned",
      opened: new Date().toISOString().split("T")[0],
      updated: new Date().toISOString().split("T")[0],
      personId: "PERSON-ET-000184",
      summary: online ? "New synthetic protection case created in verified session." : "Offline triage draft queued in local cache.",
      notes: [online ? "Created while online." : "Created offline. Pending sync queue item added."]
    };
    setLocalCases([next, ...localCases]);
  }

  return (
    <div className={`shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Role-Aware Left Sidebar */}
      <aside className="sidebar">
        <div
          className="brand"
          onClick={() => navigate("/dashboard")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/dashboard")}
          aria-label="HPIS Platform Home"
        >
          <div className="brand-mark">H</div>
          <div>
            <div className="font-bold text-white text-sm leading-none">{t("appName")}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Protection Information System</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          {NAV_ITEMS.map(({ path: navPath, key, icon: Icon }) => {
            // Hide navigation item completely if user role does not have permission
            const isVisible = allowedPaths.includes(navPath);
            if (!isVisible) return null;

            const isActive = path === navPath || (navPath === "/cases" && path.startsWith("/cases/"));
            return (
              <button
                key={navPath}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => navigate(navPath)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} className={isActive ? "text-sky-400" : "text-slate-400"} />
                <span>{t(key)}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Session */}
        <div className="p-3 border-t border-white/10 bg-black/10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
              <UserCheck size={14} />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white truncate" title={profile?.fullName}>
                {profile?.fullName || user.email?.split("@")[0]}
              </div>
              <div className="text-[10px] text-sky-400 font-mono uppercase tracking-wide">
                {role}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 text-xs bg-slate-800/80 hover:bg-red-950/60 hover:text-red-300 text-slate-300 rounded border border-white/5 transition-colors"
            title="Sign out of current session"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-col min-h-screen">
        {/* Institutional Top Bar */}
        <header className="topbar">
          <button
            className="btn-secondary md:hidden p-1.5"
            aria-label="Open navigation menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={18} />
          </button>

          <div className="search-box">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search cases, persons, tracing requests (Ctrl+K)..."
              aria-label="Global Search"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <StatusPill tone={online ? "ok" : "warn"} icon={online ? <Wifi size={13} /> : <WifiOff size={13} />}>
              {online ? "Online" : "Offline Cache"}
            </StatusPill>

            <button
              type="button"
              className={`btn-secondary text-xs ${privacyMode ? "bg-amber-100 border-amber-300 text-amber-900 font-semibold" : ""}`}
              onClick={() => setPrivacyMode(!privacyMode)}
              title="Toggle Emergency Privacy Mode (Redact PII)"
            >
              <Shield size={14} className={privacyMode ? "text-amber-700" : "text-slate-500"} />
              <span className="hidden sm:inline">{t("emergencyPrivacy")}</span>
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-white border border-slate-300 text-xs rounded px-2 py-1.5 text-slate-700 focus:outline-none focus:border-sky-600 font-medium"
              aria-label="Select Language"
            >
              <option value="en">English (EN)</option>
              <option value="am">አማርኛ (AM)</option>
            </select>
          </div>
        </header>

        {/* Global Security / Synthetic Notice */}
        <div className="notice-banner">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900">
              Demo Environment
            </span>
            <span className="truncate">{t("synthetic")}</span>
          </div>
          <span className="text-[11px] opacity-80 hidden lg:inline">{t("independent")}</span>
        </div>

        {/* Content Viewport */}
        <div className="main-content flex-1">
          {!isAllowed ? (
            <AccessDenied role={role} onNavigateDashboard={() => navigate("/dashboard")} />
          ) : (
            <Router
              path={path}
              t={t}
              privacyMode={privacyMode}
              createDemoCase={createDemoCase}
              localCases={localCases}
              online={online}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function Router({
  path,
  t,
  privacyMode,
  createDemoCase,
  localCases,
  online
}: {
  path: string;
  t: (key: Parameters<typeof translate>[1]) => string;
  privacyMode: boolean;
  createDemoCase: () => void;
  localCases: HumanitarianCase[];
  online: boolean;
}) {
  if (path === "/cases/new") return <CaseForm createDemoCase={createDemoCase} online={online} />;
  if (path.startsWith("/cases/")) return <CaseDetail caseItem={localCases[0]} privacyMode={privacyMode} />;
  
  switch (path) {
    case "/dashboard":
      return <Dashboard t={t} privacyMode={privacyMode} localCases={localCases} />;
    case "/cases":
      return <CaseList localCases={localCases} createDemoCase={createDemoCase} privacyMode={privacyMode} />;
    case "/family-links":
      return <FamilyLinks t={t} privacyMode={privacyMode} />;
    case "/referrals":
      return <Referrals />;
    case "/services":
      return <ServicesMap />;
    case "/analytics":
      return <Analytics />;
    case "/data-quality":
      return <DataQuality />;
    case "/security":
      return <SecurityCenter privacyMode={privacyMode} />;
    case "/audit-logs":
      return <Audit />;
    case "/privacy":
      return <PrivacyCenter />;
    case "/offline":
      return <Offline online={online} />;
    case "/ai-assistant":
      return <AiAssistant t={t} />;
    case "/demo":
      return <Demo createDemoCase={createDemoCase} />;
    default:
      return <Settings />;
  }
}
