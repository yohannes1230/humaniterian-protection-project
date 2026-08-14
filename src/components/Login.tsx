import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Shield, Mail, Lock, KeyRound, Sparkles, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import type { Role } from "../types";

interface DemoAccount {
  role: Role;
  label: string;
  email: string;
  scope: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "SUPER_ADMIN", label: "Super Admin", email: "admin.demo@hpis.example", scope: "Full system administration & policy management" },
  { role: "PROGRAM_MANAGER", label: "Program Manager", email: "manager.demo@hpis.example", scope: "Operational oversight, referrals & HXL exports" },
  { role: "PROTECTION_OFFICER", label: "Protection Officer", email: "officer.demo@hpis.example", scope: "Case creation, updates & family link matching" },
  { role: "CASE_WORKER", label: "Case Worker", email: "worker.demo@hpis.example", scope: "Assigned case management & client notes" },
  { role: "DATA_OFFICER", label: "Data Officer", email: "data.demo@hpis.example", scope: "Analytics, data hygiene & HXL interoperability" },
  { role: "FIELD_OFFICER", label: "Field Officer", email: "field.demo@hpis.example", scope: "Offline intake & field triage" },
  { role: "AUDITOR", label: "Compliance Auditor", email: "auditor.demo@hpis.example", scope: "Immutable audit logs & access monitoring" },
  { role: "VIEWER", label: "Viewer / Observer", email: "viewer.demo@hpis.example", scope: "Read-only aggregated signals" },
];

export function Login() {
  const { signInWithPassword, signInWithOtp, resetPassword } = useAuth();
  const [authMode, setAuthMode] = useState<"password" | "magic_link" | "reset">("password");
  const [email, setEmail] = useState("admin.demo@hpis.example");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (authMode === "password") {
      const res = await signInWithPassword(email, password);
      if (res.error) setError(res.error);
    } else if (authMode === "magic_link") {
      const res = await signInWithOtp(email);
      if (res.error) {
        setError(res.error);
      } else {
        setMessage("Magic link dispatched. Check your institutional inbox to complete authentication.");
      }
    } else if (authMode === "reset") {
      const res = await resetPassword(email);
      if (res.error) {
        setError(res.error);
      } else {
        setMessage("Password reset instructions dispatched to your email address.");
      }
    }
    setLoading(false);
  };

  const selectDemoAccount = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword("demo1234");
    setError(null);
    setMessage(null);
  };

  return (
    <div className="login-canvas">
      <div className="login-container">
        
        {/* Institutional Header */}
        <div className="login-header">
          <div className="login-brand-icon">
            <Shield size={26} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="login-title">Humanitarian Protection IS</h1>
            <p className="login-subtitle">Secure Operations & Case Management Portal</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="login-notice">
          <Shield size={16} className="text-slate-500 shrink-0" />
          <span>Restricted institutional access. All access attempts and telemetry are cryptographically logged.</span>
        </div>

        {/* Main Authentication Card */}
        <div className="login-card">
          {/* Mode Selector Tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${authMode === "password" ? "active" : ""}`}
              onClick={() => { setAuthMode("password"); setError(null); setMessage(null); }}
            >
              Password
            </button>
            <button
              type="button"
              className={`login-tab ${authMode === "magic_link" ? "active" : ""}`}
              onClick={() => { setAuthMode("magic_link"); setError(null); setMessage(null); }}
            >
              Magic Link
            </button>
            <button
              type="button"
              className={`login-tab ${authMode === "reset" ? "active" : ""}`}
              onClick={() => { setAuthMode("reset"); setError(null); setMessage(null); }}
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="alert-box danger" role="alert">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="alert-box success" role="status">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="form-label" htmlFor="login-email">Institutional Email</label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  required
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@organization.example"
                  autoComplete="email"
                />
              </div>
            </div>

            {authMode === "password" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="form-label m-0" htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("reset"); setError(null); setMessage(null); }}
                    className="text-xs text-sky-700 hover:text-sky-900 bg-transparent p-0 border-0 font-medium underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="input-group">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : authMode === "password" ? (
                <span className="flex items-center justify-center gap-2">Sign In with Credentials <ArrowRight size={16} /></span>
              ) : authMode === "magic_link" ? (
                <span className="flex items-center justify-center gap-2">Send One-Time Magic Link <KeyRound size={16} /></span>
              ) : (
                <span className="flex items-center justify-center gap-2">Dispatch Reset Link <ArrowRight size={16} /></span>
              )}
            </button>
          </form>
        </div>

        {/* Seeded Demo Credentials Panel */}
        <div className="demo-credentials-panel">
          <div className="demo-credentials-header">
            <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <Sparkles size={16} className="text-amber-600" />
              <span>Seeded Evaluation Accounts (RBAC)</span>
            </div>
            <span className="text-xs text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded font-mono">
              Password: demo1234
            </span>
          </div>

          <p className="text-xs text-slate-700 m-0">
            Select any role below to pre-populate credentials and test server-enforced permissions:
          </p>

          <div className="demo-accounts-grid">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = email === acc.email;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => selectDemoAccount(acc)}
                  className={`demo-account-card ${isSelected ? "selected" : ""}`}
                  aria-label={`Select ${acc.label} role`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-xs text-slate-900 font-semibold">{acc.label}</strong>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {acc.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 truncate block mt-0.5">{acc.email}</span>
                  <span className="text-[11px] text-slate-600 line-clamp-1 mt-1 opacity-90">{acc.scope}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="login-footer">
          <span>HPIS Platform v2.0 &bull; Independent Portfolio Prototype &bull; WCAG 2.1 AA Compliant</span>
        </div>

      </div>
    </div>
  );
}
