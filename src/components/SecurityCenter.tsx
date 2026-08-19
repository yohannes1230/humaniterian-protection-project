import { ShieldAlert, FileClock, Lock, KeyRound } from 'lucide-react';
import { PageTitle, Panel, DataTable, Metric, StatusPill, statusColors } from "./Shared";
import { securityEvents, auditLogs, users } from "../data";
import { useAuth } from "./AuthContext";

export function SecurityCenter({ privacyMode }: { privacyMode: boolean }) {
  const { role } = useAuth();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  // Compute real-time MFA adoption from user directory
  const mfaEnrolledCount = users.filter(u => u.mfaEnabled).length;
  const mfaAdoptionPercent = Math.round((mfaEnrolledCount / users.length) * 100);

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Institutional Security Operations Center"
        kicker="Cryptographic Integrity, MFA Posture & Defense-in-Depth Telemetry"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold px-2 py-1 rounded">
              RLS & JWT Active
            </span>
          </div>
        }
      />

      <div className="metric-grid">
        <Metric label="Security Integrity" value="98.4%" hint="RLS & JWT validation" />
        <Metric
          label="MFA Adoption Rate"
          value={`${mfaAdoptionPercent}%`}
          hint={`${mfaEnrolledCount} of ${users.length} officer accounts enrolled`}
        />
        <Metric label="Active Sessions" value={privacyMode ? "Masked" : `${users.length}`} hint="Seeded role sessions" />
        <Metric label="Policy Violations" value="0" hint="0 RLS bypass attempts" />
      </div>

      {isSuperAdmin && (
        <Panel title="Super Admin Telemetry: Officer MFA Posture" icon={<KeyRound size={16} className="text-sky-700" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-2">
            <div className="p-3 bg-sky-50 border border-sky-200 rounded text-xs text-sky-950">
              <strong className="block mb-1 font-bold">Mandatory MFA Policy Compliance</strong>
              <p className="m-0 leading-relaxed text-slate-700 text-[11px]">
                Privileged accounts (Super Admin, Protection Officer, Auditor) are mandated to enroll TOTP hardware/software authenticators. Unenrolled field workers operate under restricted scoped RLS.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <span>Privileged Roles Enrolled:</span>
                <span className="font-semibold text-emerald-700">100% (4/4)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Field & Operational Roles:</span>
                <span className="font-semibold text-amber-700">33% (1/3)</span>
              </div>
            </div>
          </div>
        </Panel>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Panel title="Security & Threat Monitoring Events" icon={<ShieldAlert size={16} className="text-slate-600" />}>
            <DataTable
              columns={["Event Identifier", "Detection Category", "Severity", "Timestamp", "Enforcement State"]}
              rows={securityEvents.map((event) => [
                <span key={event.id} className="font-mono text-xs font-semibold">{event.id}</span>,
                event.type.replace(/_/g, " "),
                <StatusPill key={event.id} tone={event.severity === "High" ? "danger" : "warn"}>{event.severity}</StatusPill>,
                <span key={`${event.id}-ts`} className="font-mono text-xs text-slate-500">{event.timestamp}</span>,
                <span key={`${event.id}-st`} className="text-xs font-medium text-emerald-700">{event.status}</span>
              ])}
            />
          </Panel>
        </div>

        <div>
          <Panel title="Access Architecture Safeguards" icon={<Lock size={16} className="text-slate-600" />}>
            <div className="flex flex-col gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-slate-900 mb-0.5">PostgreSQL RLS Enforcement</strong>
                <p className="m-0 text-slate-500 text-[11px]">Database policies ensure no raw row bypass across all tables.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-slate-900 mb-0.5">AES-256-GCM Field Encryption</strong>
                <p className="m-0 text-slate-500 text-[11px]">Sensitive case summaries & PII encrypted at rest before database write.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-slate-900 mb-0.5">Immutable Audit Trail</strong>
                <p className="m-0 text-slate-500 text-[11px]">Server service-role exclusive writes prevent forged audit records.</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function Audit() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Immutable Audit & Compliance Log"
        kicker="Cryptographic Accountability & Access Logs (docs/rbac-matrix.md)"
      />

      <Panel title="Append-Only Audit Stream" icon={<FileClock size={16} className="text-slate-600" />}>
        <DataTable
          columns={["Operator", "Action Performed", "Target Resource", "Timestamp", "Status"]}
          rows={auditLogs.map((log) => [
            <span key={log.id} className="font-semibold text-slate-800">{log.user}</span>,
            <span key={`${log.id}-act`} className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{log.action}</span>,
            <span key={`${log.id}-res`} className="font-mono text-xs text-slate-600">{log.resource}</span>,
            <span key={`${log.id}-ts`} className="font-mono text-xs text-slate-500">{log.timestamp}</span>,
            <StatusPill key={`${log.id}-res-p`} tone={statusColors[log.result]}>{log.result}</StatusPill>
          ])}
        />
      </Panel>
    </div>
  );
}
