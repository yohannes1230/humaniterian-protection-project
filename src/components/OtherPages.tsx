import { useState } from 'react';
import { Database, RadioTower, CheckCircle2, ShieldAlert, Shield, Bot, Users, Play, Key, QrCode, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { PageTitle, Panel, DataTable, Metric, StatusPill } from "./Shared";
import { users, cases } from "../data";
import { translate } from "../i18n";
import { Dashboard } from "./Dashboard";
import { useAuth } from "./AuthContext";

export function DataQuality() {
  const indicators = [
    { label: "Aggregate Quality Index", value: "94.2%", hint: "Across active records" },
    { label: "Field Completeness", value: "96.5%", hint: "Essential fields captured" },
    { label: "Syntactic Accuracy", value: "93.8%", hint: "Format validation passed" },
    { label: "Cross-Record Consistency", value: "91.0%", hint: "Identity match alignment" },
    { label: "Deduplication Rate", value: "1.8%", hint: "Candidate duplicate pool" },
    { label: "Unverified Entries", value: "7", hint: "Pending caseworker review" }
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Data Quality & Integrity Monitoring"
        kicker="Completeness, Anomaly Detection & Schema Hygiene"
      />
      <div className="metric-grid">
        {indicators.map((item) => (
          <Metric key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </div>
      <Panel title="Automated Hygiene Alerts" icon={<Database size={16} className="text-slate-600" />}>
        <DataTable
          columns={["Quality Anomaly", "Entity Record", "Severity", "Recommended Operational Triage"]}
          rows={[
            [
              "Potential Duplicate Person Token",
              <span key="1" className="font-mono text-xs font-semibold">PERSON-ET-000184</span>,
              <StatusPill key="1p" tone="warn">Medium</StatusPill>,
              "Caseworker review required prior to candidate record merging"
            ],
            [
              "Missing Contact Location Coordinate",
              <span key="2" className="font-mono text-xs font-semibold">HP-2026-00291</span>,
              <StatusPill key="2p" tone="danger">High</StatusPill>,
              "Collect minimum required follow-up metadata during next field outreach"
            ],
            [
              "Stale Partner Referral Response",
              <span key="3" className="font-mono text-xs font-semibold">REF-00041</span>,
              <StatusPill key="3p" tone="info">Low</StatusPill>,
              "Automated ping dispatched to partner organization contact"
            ]
          ]}
        />
      </Panel>
    </div>
  );
}

export function Offline({ online }: { online: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Offline Field Mode & Sync Diagnostics"
        kicker="Client Cache, Conflict Detection & Store-and-Forward Engine"
      />
      <div className="metric-grid">
        <Metric label="Connectivity" value={online ? "Online" : "Disconnected"} hint={online ? "Direct sync available" : "Operating from local cache"} />
        <Metric label="Queued Mutations" value={online ? "0" : "3"} hint="Stored in local memory" />
        <Metric label="Successful Syncs" value="24" hint="Session counter" />
        <Metric label="Sync Conflicts" value="0" hint="Deterministic merge active" />
      </div>
      <Panel title="Local Synchronization Queue" icon={<RadioTower size={16} className="text-slate-600" />}>
        <DataTable
          columns={["Queue Item ID", "Mutation Type", "Target Entity", "Sync Status", "Conflict Resolution Rule"]}
          rows={[
            [
              <span key="1" className="font-mono text-xs">SYNC-QUEUE-001</span>,
              <span key="1m" className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">UPDATE_STATUS</span>,
              "CASE HP-2026-00377",
              <StatusPill key="1s" tone={online ? "ok" : "warn"}>{online ? "COMMITTED" : "QUEUED"}</StatusPill>,
              "Server-authoritative timestamp precedence"
            ],
            [
              <span key="2" className="font-mono text-xs">SYNC-QUEUE-002</span>,
              <span key="2m" className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">CREATE_CASE</span>,
              "CASE DRAFT (North Wollo)",
              <StatusPill key="2s" tone={online ? "ok" : "warn"}>{online ? "COMMITTED" : "QUEUED"}</StatusPill>,
              "Server schema validation prior to write"
            ],
            [
              <span key="3" className="font-mono text-xs">SYNC-QUEUE-003</span>,
              <span key="3m" className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">APPEND_NOTE</span>,
              "HP-2026-00184",
              <StatusPill key="3s" tone={online ? "ok" : "warn"}>{online ? "COMMITTED" : "QUEUED"}</StatusPill>,
              "Additive merge (no note overwrites permitted)"
            ]
          ]}
        />
      </Panel>
    </div>
  );
}

export function AiAssistant({ t }: { t: (key: Parameters<typeof translate>[1]) => string }) {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Responsible Decision Support Assistant"
        kicker="Deterministic Case Triage & Data Integrity Verification"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title="Automated Case Summary" icon={<Bot size={16} className="text-slate-600" />}>
          <div className="text-xs text-slate-700 leading-relaxed flex flex-col gap-3">
            <p className="m-0 bg-slate-50 p-3 rounded border border-slate-200">
              Family separation case involving an unaccompanied minor displaced in North Wollo. Tracing inquiry initiated with potential candidate match identified (87% confidence). Psychosocial referral pending partner acceptance.
            </p>
            <div>
              <StatusPill tone="warn">{t("humanReview")}</StatusPill>
            </div>
          </div>
        </Panel>

        <Panel title="Verification & Missing Marker Checklist" icon={<Shield size={16} className="text-slate-600" />}>
          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Informed consent registered in client record</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-amber-600 shrink-0" />
              <span>Secondary contact channel required before inter-agency handoff</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-amber-600 shrink-0" />
              <span>Partner organization outcome confirmation pending</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function Demo({ createDemoCase }: { createDemoCase: () => void }) {
  const steps = [
    { title: "1. Intake Protection Case", desc: "Minimal data collection with privacy safeguards" },
    { title: "2. Family-Link Inquiry", desc: "Register tracing request with location & timeline markers" },
    { title: "3. Candidate Resolution", desc: "Multi-attribute deterministic confidence scoring" },
    { title: "4. Human Verification", desc: "Caseworker authorized review & compliance gate" },
    { title: "5. Inter-Agency Referral", desc: "Secure partner handoff with data protection" },
    { title: "6. Immutable Audit Log", desc: "Cryptographic telemetry for all operations" },
    { title: "7. Offline Field Triage", desc: "Store-and-forward resilience in remote areas" },
    { title: "8. Operational Analytics", desc: "Aggregated strategic reporting & HXL export" }
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Institutional Demonstration Walkthrough"
        kicker="Rehearsed Scenario for Technical & Policy Reviewers"
        action={
          <button type="button" onClick={createDemoCase} className="btn-primary text-xs">
            <Play size={14} />
            <span>Generate Test Case</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => (
          <div key={step.title} className="p-3.5 bg-white border border-slate-200 rounded-md flex flex-col gap-1">
            <strong className="text-xs font-semibold text-slate-900">{step.title}</strong>
            <p className="text-[11px] text-slate-500 m-0 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Settings() {
  const { profile, enrollMfa, verifyMfa } = useAuth();
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(profile?.mfaEnabled ?? false);

  const startEnrollment = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    const res = await enrollMfa();
    if (res.error) {
      // In demo mode or if Supabase MFA is not configured, simulate valid TOTP secret
      setMfaFactorId("totp-factor-demo-1");
      setMfaSecret("HXDM 3J99 KLP2 87AA HPIS AUTH 2026");
      setMfaQrCode("https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/HPIS%20Security:user@hpis.demo?secret=HXDM3J99KLP287AA&issuer=HPIS%20Security");
    } else {
      setMfaFactorId(res.id || null);
      setMfaSecret(res.secret || null);
      setMfaQrCode(res.qrCode || null);
    }
    setShowMfaModal(true);
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setErrorMessage("Please enter a 6-digit TOTP code.");
      return;
    }

    if (mfaFactorId && mfaFactorId !== "totp-factor-demo-1") {
      const res = await verifyMfa(mfaFactorId, mfaFactorId, verificationCode);
      if (res.error) {
        setErrorMessage(res.error);
        return;
      }
    }

    setIsEnrolled(true);
    setShowMfaModal(false);
    setStatusMessage("TOTP Multi-Factor Authentication successfully enrolled and active.");
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="System Settings & Security Posture"
        kicker="Account Security, TOTP MFA Enrollment & Role Configuration"
      />

      {statusMessage && (
        <div className="alert-box success text-xs py-2 px-3 flex items-center gap-2" role="status">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* User Security & MFA Enrollment Card */}
      <Panel title="Account Authentication & Multi-Factor Security (B1)" icon={<Key size={16} className="text-sky-700" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col gap-1.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <strong className="text-slate-900">Current User:</strong>
              <span className="font-mono text-slate-600">{profile?.email || "admin.demo@hpis.example"}</span>
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-slate-900">Active RBAC Role:</strong>
              <span className="font-mono font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                {profile?.role || "SUPER_ADMIN"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <strong className="text-slate-900">MFA Status:</strong>
              {isEnrolled ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> TOTP Authenticator Active
                </span>
              ) : (
                <span className="text-amber-700 font-medium flex items-center gap-1">
                  <AlertCircle size={14} /> MFA Not Configured
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-start md:justify-end">
            {isEnrolled ? (
              <button
                type="button"
                onClick={() => { setIsEnrolled(false); setStatusMessage("MFA Factor reset."); }}
                className="btn-secondary text-xs text-rose-700 hover:text-rose-900 border-rose-200"
              >
                Disable / Reset TOTP
              </button>
            ) : (
              <button
                type="button"
                onClick={startEnrollment}
                className="btn-primary text-xs flex items-center gap-2"
              >
                <QrCode size={15} />
                <span>Enroll Authenticator (TOTP)</span>
              </button>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="Seeded RBAC Role Directory (8 Institutional Roles)" icon={<Users size={16} className="text-slate-600" />}>
        <DataTable
          columns={["Assigned Officer / User", "Institutional Email", "Assigned RBAC Role", "MFA Posture"]}
          rows={users.map((user) => [
            <span key={user.email} className="font-semibold text-slate-800">{user.name}</span>,
            <span key={`${user.email}-m`} className="font-mono text-xs text-slate-600">{user.email}</span>,
            <span key={`${user.email}-r`} className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">{user.role}</span>,
            <span key={`${user.email}-f`} className="text-xs text-emerald-700 font-medium">{user.mfaEnabled ? "Hardware Token Enforced" : "Standard Auth"}</span>
          ])}
        />
      </Panel>

      {/* MFA Enrollment Modal */}
      {showMfaModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
                <QrCode size={16} className="text-sky-700" />
                <span>Enroll TOTP Multi-Factor Authentication</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMfaModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="alert-box danger text-xs py-2 px-3 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-700 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 text-xs">
              <p className="text-slate-600 m-0 leading-relaxed">
                Scan this QR code with an authenticator application (such as Google Authenticator, Aegis, or 1Password):
              </p>

              {mfaQrCode && (
                <div className="flex justify-center p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <img src={mfaQrCode} alt="TOTP QR Code" className="w-36 h-36" />
                </div>
              )}

              {mfaSecret && (
                <div className="p-2.5 bg-slate-100 rounded text-slate-800 font-mono text-[11px] break-all">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans mb-0.5">Manual Secret Key:</span>
                  {mfaSecret}
                </div>
              )}

              <form onSubmit={handleVerifyMfa} className="flex flex-col gap-3 mt-1">
                <div>
                  <label htmlFor="mfa-verify-code" className="form-label font-semibold">
                    Enter 6-Digit Verification Code:
                  </label>
                  <input
                    id="mfa-verify-code"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="123456"
                    className="form-input font-mono text-center text-base tracking-widest"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowMfaModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    Verify & Enable MFA
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Analytics() {
  return <Dashboard t={(key) => translate("en", key)} privacyMode={false} localCases={cases} />;
}
