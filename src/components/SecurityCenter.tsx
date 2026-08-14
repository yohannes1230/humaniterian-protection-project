import { ShieldAlert, FileClock, ShieldCheck, Lock, Activity } from 'lucide-react';
import { PageTitle, Panel, DataTable, Metric, StatusPill, statusColors } from "./Shared";
import { securityEvents, auditLogs } from "../data";

export function SecurityCenter({ privacyMode }: { privacyMode: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Institutional Security Operations Center"
        kicker="Cryptographic Integrity & Defense-in-Depth Telemetry"
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
        <Metric label="Auth Failures" value="0" hint="Last 24 hours" />
        <Metric label="Active Sessions" value={privacyMode ? "Masked" : "8"} hint="Seeded role sessions" />
        <Metric label="Policy Violations" value="0" hint="0 RLS bypass attempts" />
      </div>

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
                <strong className="block text-slate-900 mb-0.5">Supabase JWT Signature Check</strong>
                <p className="m-0 text-slate-500 text-[11px]">Every API request independently verifies claims and profile bindings.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-slate-900 mb-0.5">Immutable Audit Trail</strong>
                <p className="m-0 text-slate-500 text-[11px]">All administrative and triage mutations write to append-only logs.</p>
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
