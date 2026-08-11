import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  BriefcaseMedical,
  CheckCircle2,
  Database,
  FileClock,
  FileText,
  Globe2,
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
  WifiOff
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { auditLogs, cases, caseTrend, familyLinks, persons, referrals, regionCounts, securityEvents, services, users } from "./data";
import { translate, type Language } from "./i18n";
import type { HumanitarianCase, Role } from "./types";

const nav = [
  ["/dashboard", "dashboard", Home],
  ["/cases", "cases", FileText],
  ["/family-links", "familyLinks", Users],
  ["/referrals", "referrals", BriefcaseMedical],
  ["/services", "services", MapPinned],
  ["/analytics", "analytics", BarChart3],
  ["/data-quality", "dataQuality", Database],
  ["/security", "security", ShieldAlert],
  ["/audit-logs", "audit", FileClock],
  ["/privacy", "privacy", Lock],
  ["/offline", "offline", RadioTower],
  ["/ai-assistant", "ai", Bot],
  ["/demo", "demo", Activity],
  ["/settings", "settings", SlidersHorizontal]
] as const;

const roleAccess: Record<Role, string[]> = {
  SUPER_ADMIN: nav.map(([path]) => path),
  PROGRAM_MANAGER: ["/dashboard", "/cases", "/family-links", "/referrals", "/services", "/analytics", "/data-quality", "/audit-logs", "/privacy", "/demo", "/settings"],
  PROTECTION_OFFICER: ["/dashboard", "/cases", "/family-links", "/referrals", "/services", "/offline", "/ai-assistant", "/demo", "/settings"],
  CASE_WORKER: ["/dashboard", "/cases", "/referrals", "/services", "/offline", "/ai-assistant", "/settings"],
  DATA_OFFICER: ["/dashboard", "/cases", "/analytics", "/data-quality", "/audit-logs", "/ai-assistant", "/settings"],
  FIELD_OFFICER: ["/dashboard", "/cases", "/referrals", "/services", "/offline", "/settings"],
  AUDITOR: ["/dashboard", "/security", "/audit-logs", "/privacy", "/settings"],
  VIEWER: ["/dashboard", "/analytics", "/services", "/settings"]
};

const statusColors: Record<string, string> = {
  LOW: "ok",
  MEDIUM: "info",
  HIGH: "warn",
  CRITICAL: "danger",
  NEW: "info",
  ASSESSMENT: "info",
  INVESTIGATION: "warn",
  REFERRAL: "warn",
  FOLLOW_UP: "info",
  RESOLVED: "ok",
  ARCHIVED: "neutral",
  SUCCESS: "ok",
  DENIED: "danger"
};

function currentPath() {
  return window.location.pathname === "/" ? "/dashboard" : window.location.pathname;
}

export function App() {
  const [path, setPath] = useState(currentPath());
  const [language, setLanguage] = useState<Language>("en");
  const [currentUser, setCurrentUser] = useState(users[0]);
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

  const allowed = roleAccess[currentUser.role].includes(path) || path.startsWith("/cases/");
  const shellClass = sidebarOpen ? "shell sidebar-open" : "shell";

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
      assignedOfficer: currentUser.name,
      opened: "2026-08-11",
      updated: "2026-08-11",
      personId: "PERSON-ET-000184",
      summary: online ? "New synthetic case created from the demo workflow." : "Offline draft stored locally and queued for synchronization.",
      notes: [online ? "Created while online." : "Created offline. Pending sync queue item added."]
    };
    setLocalCases([next, ...localCases]);
  }

  return (
    <div className={shellClass}>
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate("/dashboard")} role="button" tabIndex={0}>
          <span className="brand-mark">H</span>
          <span>
            <strong>{t("appName")}</strong>
            <small>Protection IS</small>
          </span>
        </div>
        <nav>
          {nav.map(([navPath, label, Icon]) => {
            const visible = roleAccess[currentUser.role].includes(navPath);
            if (!visible) return null;
            return (
              <button className={path === navPath ? "active" : ""} key={navPath} onClick={() => navigate(navPath)}>
                <Icon size={18} />
                <span>{t(label)}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <main>
        <header className="topbar">
          <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <div className="search">
            <Search size={18} />
            <span>Search cases, referrals, persons</span>
          </div>
          <StatusPill tone={online ? "ok" : "warn"} icon={online ? <Wifi size={15} /> : <WifiOff size={15} />}>
            {online ? "Online" : "Offline - 3 pending"}
          </StatusPill>
          <button className="mode-button" onClick={() => setPrivacyMode(!privacyMode)}>
            <Shield size={16} />
            {t("emergencyPrivacy")}
          </button>
          <button className="icon-button" aria-label="Notifications">
            <Bell size={19} />
          </button>
          <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Language">
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
          <select value={currentUser.id} onChange={(event) => setCurrentUser(users.find((user) => user.id === event.target.value) ?? users[0])}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.role}</option>
            ))}
          </select>
        </header>
        <section className="notice">
          <strong>{t("synthetic")}</strong>
          <span>{t("independent")}</span>
        </section>
        <section className="content">
          {!allowed ? (
            <AccessDenied role={currentUser.role} />
          ) : (
            <Router path={path} t={t} privacyMode={privacyMode} createDemoCase={createDemoCase} localCases={localCases} online={online} />
          )}
        </section>
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
      return <Cases localCases={localCases} createDemoCase={createDemoCase} privacyMode={privacyMode} />;
    case "/family-links":
      return <FamilyLinks t={t} privacyMode={privacyMode} />;
    case "/referrals":
      return <Referrals />;
    case "/services":
      return <Services />;
    case "/analytics":
      return <Analytics />;
    case "/data-quality":
      return <DataQuality />;
    case "/security":
      return <Security privacyMode={privacyMode} />;
    case "/audit-logs":
      return <Audit />;
    case "/privacy":
      return <Privacy />;
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

function PageTitle({ title, kicker, action }: { title: string; kicker?: string; action?: React.ReactNode }) {
  return (
    <div className="page-title">
      <div>
        <p>{kicker}</p>
        <h1>{title}</h1>
      </div>
      {action}
    </div>
  );
}

function StatusPill({ children, tone = "neutral", icon }: { children: React.ReactNode; tone?: string; icon?: React.ReactNode }) {
  return <span className={`pill ${tone}`}>{icon}{children}</span>;
}

function Dashboard({ t, privacyMode, localCases }: { t: (key: Parameters<typeof translate>[1]) => string; privacyMode: boolean; localCases: HumanitarianCase[] }) {
  const metrics = [
    ["Active Cases", "1,248", "Across synthetic operations"],
    ["High Priority", "143", "Requires review"],
    ["Family-Link Cases", "327", "Tracing workflow"],
    ["Open Referrals", "216", "Pending coordination"],
    ["Resolved This Month", "184", "Average 18.4 days"],
    ["Security Events", privacyMode ? "Restricted" : "4", "Last review today"]
  ];
  return (
    <>
      <PageTitle title={t("dashboard")} kicker="Executive operational overview" />
      <div className="metric-grid">
        {metrics.map(([label, value, hint]) => <Metric key={label} label={label} value={value} hint={hint} />)}
      </div>
      <div className="grid two">
        <Panel title="Cases By Region" icon={<BarChart3 size={18} />}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {regionCounts.map((entry, index) => <Cell key={entry.name} fill={["#1b75bc", "#00856f", "#f2b705", "#b63f3f", "#5b6472"][index]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Resolution Trend" icon={<Activity size={18} />}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={caseTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cases" stroke="#1b75bc" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#00856f" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <Panel title="Recent Case Signals" icon={<FileText size={18} />}>
        <DataTable
          columns={["Case", "Type", "Priority", "Status", "Assigned"]}
          rows={localCases.slice(0, 4).map((caseItem) => [
            caseItem.id,
            caseItem.type,
            <StatusPill key={caseItem.id} tone={statusColors[caseItem.priority]}>{caseItem.priority}</StatusPill>,
            <StatusPill key={`${caseItem.id}-s`} tone={statusColors[caseItem.status]}>{caseItem.status}</StatusPill>,
            caseItem.assignedOfficer
          ])}
        />
      </Panel>
    </>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2>{icon}{title}</h2>
      {children}
    </section>
  );
}

function Cases({ localCases, createDemoCase, privacyMode }: { localCases: HumanitarianCase[]; createDemoCase: () => void; privacyMode: boolean }) {
  return (
    <>
      <PageTitle title="Case Management" kicker="Workflow, assignment, notes, referrals and history" action={<button onClick={createDemoCase}>Create synthetic case</button>} />
      <Panel title="Cases" icon={<FileText size={18} />}>
        <DataTable
          columns={["Case ID", "Person", "Type", "Region", "Priority", "Status", "Officer"]}
          rows={localCases.map((caseItem) => {
            const person = persons.find((item) => item.id === caseItem.personId);
            return [
              <a key={caseItem.id} href={`/cases/${caseItem.id}`}>{caseItem.id}</a>,
              privacyMode ? "Restricted" : person?.pseudonym ?? "Unknown",
              caseItem.type,
              caseItem.region,
              <StatusPill key={`${caseItem.id}-p`} tone={statusColors[caseItem.priority]}>{caseItem.priority}</StatusPill>,
              <StatusPill key={`${caseItem.id}-s`} tone={statusColors[caseItem.status]}>{caseItem.status}</StatusPill>,
              caseItem.assignedOfficer
            ];
          })}
        />
      </Panel>
    </>
  );
}

function CaseForm({ createDemoCase, online }: { createDemoCase: () => void; online: boolean }) {
  return (
    <>
      <PageTitle title="New Case" kicker={online ? "Online validation active" : "Offline draft mode"} />
      <Panel title="Minimal Intake" icon={<FileText size={18} />}>
        <div className="form-grid">
          <label>Case type<input defaultValue="FAMILY_SEPARATION" /></label>
          <label>Priority<input defaultValue="HIGH" /></label>
          <label>Region<input defaultValue="Amhara" /></label>
          <label>Location<input defaultValue="North Wollo" /></label>
          <label className="wide">Processing notice<textarea defaultValue="Only synthetic and necessary data is recorded for this demonstration." /></label>
        </div>
        <button onClick={createDemoCase}>Save case</button>
      </Panel>
    </>
  );
}

function CaseDetail({ caseItem, privacyMode }: { caseItem: HumanitarianCase; privacyMode: boolean }) {
  const person = persons.find((item) => item.id === caseItem.personId);
  return (
    <>
      <PageTitle title={`Case ${caseItem.id}`} kicker={`${caseItem.type} / ${caseItem.status}`} />
      <div className="grid split">
        <Panel title="Overview" icon={<FileText size={18} />}>
          <p className="lede">{caseItem.summary}</p>
          <div className="tab-row"><span>Overview</span><span>Person</span><span>Notes</span><span>Referrals</span><span>Family Link</span><span>Timeline</span><span>Audit</span></div>
          <DataTable columns={["Field", "Value"]} rows={[
            ["Priority", <StatusPill key="p" tone={statusColors[caseItem.priority]}>{caseItem.priority}</StatusPill>],
            ["Assigned officer", caseItem.assignedOfficer],
            ["Region", caseItem.region],
            ["Person", privacyMode ? "Restricted by Emergency Privacy Mode" : `${person?.pseudonym} (${person?.id})`],
            ["Opened", caseItem.opened],
            ["Updated", caseItem.updated]
          ]} />
        </Panel>
        <Panel title="Privacy Controls" icon={<Lock size={18} />}>
          <ul className="check-list">
            <li><CheckCircle2 size={16} /> Pseudonymized identifiers shown by default</li>
            <li><CheckCircle2 size={16} /> Sensitive view creates audit event</li>
            <li><CheckCircle2 size={16} /> Export disabled during emergency mode</li>
            <li><CheckCircle2 size={16} /> Retention policy: resolved cases archived</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}

function FamilyLinks({ t, privacyMode }: { t: (key: Parameters<typeof translate>[1]) => string; privacyMode: boolean }) {
  return (
    <>
      <PageTitle title="Family-Link & Missing-Person Workflow" kicker="Potential matching with human verification" />
      <Panel title="Tracing Requests" icon={<Users size={18} />}>
        <DataTable
          columns={["Request", "Case", "Person", "Status", "Last Contact", "Match Score", "Safeguard"]}
          rows={familyLinks.map((item) => [
            item.id,
            item.caseId,
            privacyMode ? "Restricted" : item.personId,
            <StatusPill key={item.id} tone="warn">{item.status}</StatusPill>,
            item.lastContact,
            `${item.matchScore}%`,
            t("humanReview")
          ])}
        />
      </Panel>
      <Panel title="Deterministic Match Explanation" icon={<Shield size={18} />}>
        <div className="weights">
          {["Name similarity 30%", "Age compatibility 15%", "Location similarity 20%", "Date similarity 15%", "Other attributes 20%"].map((item) => <span key={item}>{item}</span>)}
        </div>
      </Panel>
    </>
  );
}

function Referrals() {
  return (
    <>
      <PageTitle title="Referral Management" kicker="Coordination with fictional authorized partners" />
      <Panel title="Referral Queue" icon={<BriefcaseMedical size={18} />}>
        <DataTable columns={["Referral", "Case", "Category", "Organization", "Priority", "Status", "Outcome"]} rows={referrals.map((item) => [
          item.id,
          item.caseId,
          item.category,
          item.organization,
          <StatusPill key={item.id} tone={statusColors[item.priority]}>{item.priority}</StatusPill>,
          item.status,
          item.outcome
        ])} />
      </Panel>
    </>
  );
}

function Services() {
  return (
    <>
      <PageTitle title="Humanitarian Services Map" kicker="DEMONSTRATION DATA - NOT A REAL SERVICE DIRECTORY" />
      <div className="map-wrap">
        <MapContainer center={[9.145, 40.4897]} zoom={6} scrollWheelZoom={false} className="map">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {services.map((service) => (
            <Marker key={service.id} position={[service.lat, service.lng]}>
              <Popup>
                <strong>{service.name}</strong><br />
                {service.category}<br />
                {service.hours}<br />
                Contact: DEMO
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Panel title="Service Points" icon={<MapPinned size={18} />}>
        <DataTable columns={["Name", "Category", "Region", "Hours", "Services"]} rows={services.map((service) => [service.name, service.category, service.region, service.hours, service.services])} />
      </Panel>
    </>
  );
}

function Analytics() {
  return <Dashboard t={(key) => translate("en", key)} privacyMode={false} localCases={cases} />;
}

function DataQuality() {
  const indicators = [
    ["Overall Data Quality", "94%"],
    ["Completeness", "96%"],
    ["Accuracy", "93%"],
    ["Consistency", "91%"],
    ["Duplicate Rate", "2%"],
    ["Unverified Records", "7"]
  ];
  return (
    <>
      <PageTitle title="Data Quality Center" kicker="Completeness, duplicates, consistency and sync freshness" />
      <div className="metric-grid">{indicators.map(([label, value]) => <Metric key={label} label={label} value={value} hint="Synthetic quality check" />)}</div>
      <Panel title="Quality Alerts" icon={<Database size={18} />}>
        <DataTable columns={["Issue", "Entity", "Severity", "Recommended action"]} rows={[
          ["Potential duplicate person", "PERSON-ET-000184", <StatusPill key="m" tone="warn">Medium</StatusPill>, "Human review before merge"],
          ["Missing required field", "HP-2026-00291", <StatusPill key="h" tone="danger">High</StatusPill>, "Collect minimum required follow-up data"],
          ["Stale referral", "REF-00041", <StatusPill key="l" tone="info">Low</StatusPill>, "Request update from partner"]
        ]} />
      </Panel>
    </>
  );
}

function Security({ privacyMode }: { privacyMode: boolean }) {
  return (
    <>
      <PageTitle title="Security Center" kicker="Demonstration security posture" />
      <div className="metric-grid">
        <Metric label="Security Score" value="92%" hint="Demo posture, not certification" />
        <Metric label="Failed Logins" value="7" hint="Last 24 hours" />
        <Metric label="Active Sessions" value={privacyMode ? "Restricted" : "18"} hint="Session controls enabled" />
        <Metric label="Sensitive Exports" value={privacyMode ? "Disabled" : "4"} hint="Permission controlled" />
      </div>
      <Panel title="Security Events" icon={<ShieldAlert size={18} />}>
        <DataTable columns={["Event", "Type", "Severity", "Timestamp", "Status"]} rows={securityEvents.map((event) => [
          event.id,
          event.type,
          <StatusPill key={event.id} tone={event.severity === "High" ? "danger" : "warn"}>{event.severity}</StatusPill>,
          event.timestamp,
          event.status
        ])} />
      </Panel>
    </>
  );
}

function Audit() {
  return (
    <>
      <PageTitle title="Audit Center" kicker="Append-oriented accountability log" />
      <Panel title="Audit Logs" icon={<FileClock size={18} />}>
        <DataTable columns={["User", "Action", "Resource", "Timestamp", "Result"]} rows={auditLogs.map((log) => [
          log.user,
          log.action,
          log.resource,
          log.timestamp,
          <StatusPill key={log.id} tone={statusColors[log.result]}>{log.result}</StatusPill>
        ])} />
      </Panel>
    </>
  );
}

function Privacy() {
  return (
    <>
      <PageTitle title="Privacy Center" kicker="Data minimization, retention, access accountability" />
      <Panel title="Data Inventory" icon={<Lock size={18} />}>
        <DataTable columns={["Dataset", "Sensitivity", "Purpose", "Access", "Encryption", "Retention"]} rows={[
          ["Cases", "High", "Case management", "Authorized roles", "Selected fields", "Active then archive"],
          ["Person data", "Critical", "Protection workflow", "Restricted", "AES-256-GCM target", "Purpose limited"],
          ["Analytics", "Medium", "Planning", "Managers/Data", "Aggregate only", "Review monthly"],
          ["Audit logs", "High", "Accountability", "Admin/Auditor", "Protected storage", "Append-oriented"]
        ]} />
      </Panel>
      <Panel title="Privacy Impact Summary" icon={<Globe2 size={18} />}>
        <p className="lede">This prototype uses synthetic data, pseudonymized identifiers, role-based access, audit trails, retention states and an emergency privacy mode. It is an independent demonstration inspired by public humanitarian data-protection principles.</p>
      </Panel>
    </>
  );
}

function Offline({ online }: { online: boolean }) {
  return (
    <>
      <PageTitle title="Offline Field Mode" kicker="PWA cache, IndexedDB target, synchronization queue" />
      <div className="metric-grid">
        <Metric label="Connection" value={online ? "Online" : "Offline"} hint={online ? "Sync service available" : "Saving locally"} />
        <Metric label="Pending Changes" value={online ? "0" : "3"} hint="Queued in local draft store" />
        <Metric label="Successful Sync" value="18" hint="Demo device" />
        <Metric label="Conflicts" value="1" hint="Requires human resolution" />
      </div>
      <Panel title="Sync Queue" icon={<RadioTower size={18} />}>
        <DataTable columns={["Item", "Operation", "Entity", "Status", "Conflict policy"]} rows={[
          ["SYNC-001", "UPDATE", "CASE HP-2026-00377", online ? "SUCCESS" : "PENDING", "Never silently overwrite"],
          ["SYNC-002", "CREATE", "CASE DRAFT", online ? "SUCCESS" : "PENDING", "Server validation required"],
          ["SYNC-003", "NOTE", "HP-2026-00184", online ? "CONFLICT" : "PENDING", "Show both versions"]
        ]} />
      </Panel>
    </>
  );
}

function AiAssistant({ t }: { t: (key: Parameters<typeof translate>[1]) => string }) {
  return (
    <>
      <PageTitle title="Responsible AI Assistant" kicker="Demo AI mode - deterministic local assistance" />
      <div className="grid two">
        <Panel title="Case Summary" icon={<Bot size={18} />}>
          <p className="lede">Family separation case with tracing request, minimal intake complete, psychosocial referral pending, and potential match awaiting human verification.</p>
          <StatusPill tone="warn">{t("humanReview")}</StatusPill>
        </Panel>
        <Panel title="Missing Information" icon={<Shield size={18} />}>
          <ul className="check-list">
            <li><CheckCircle2 size={16} /> Consent notice recorded</li>
            <li><ShieldAlert size={16} /> Follow-up contact channel incomplete</li>
            <li><ShieldAlert size={16} /> Referral outcome pending</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}

function Demo({ createDemoCase }: { createDemoCase: () => void }) {
  const steps = ["New humanitarian case", "Family-link investigation", "Potential match", "Human review", "Referral", "Security/audit event", "Offline field update", "Synchronization", "Dashboard analytics"];
  return (
    <>
      <PageTitle title="7-Minute Demonstration Scenario" kicker="A rehearsed story for portfolio presentation" action={<button onClick={createDemoCase}>Start by creating case</button>} />
      <div className="timeline">
        {steps.map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong><p>{index === 2 ? "Show 87% potential match and explain human verification." : "Demonstrate the workflow with synthetic data."}</p></div>)}
      </div>
    </>
  );
}

function Settings() {
  return (
    <>
      <PageTitle title="Settings & RBAC" kicker="Demo accounts and role permissions" />
      <Panel title="Demo Accounts" icon={<Users size={18} />}>
        <DataTable columns={["Name", "Email", "Role", "MFA"]} rows={users.map((user) => [user.name, user.email, user.role, user.mfaEnabled ? "Enabled" : "Demo disabled"])} />
      </Panel>
    </>
  );
}

function AccessDenied({ role }: { role: Role }) {
  return (
    <Panel title="Access Restricted" icon={<ShieldAlert size={18} />}>
      <p className="lede">Your current demo role, {role}, does not have permission to view this module. This restriction is shown in the UI and documented for server-side enforcement in the target architecture.</p>
    </Panel>
  );
}

function DataTable({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
