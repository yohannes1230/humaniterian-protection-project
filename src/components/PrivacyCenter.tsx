import { Lock, ShieldCheck, EyeOff } from 'lucide-react';
import { PageTitle, Panel, DataTable, StatusPill } from "./Shared";

export function PrivacyCenter() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Institutional Privacy & Data Protection Center"
        kicker="Data Minimization, Pseudonymization & ICRC Professional Standards Compliance"
      />

      <Panel title="Institutional Data Protection Inventory" icon={<Lock size={16} className="text-slate-600" />}>
        <DataTable
          columns={["Data Domain", "Sensitivity Rating", "Lawful Operational Purpose", "Authorized RBAC Scope", "Encryption Standard", "Retention Lifecycle"]}
          rows={[
            [
              <span key="c" className="font-semibold text-slate-800">Protection Cases</span>,
              <StatusPill key="cp" tone="danger">High Severity</StatusPill>,
              "Casework & Protection Tracking",
              "Protection Officers, Case Workers",
              <span key="ce" className="font-mono text-xs">AES-256-GCM / TLS 1.3</span>,
              "Active &rarr; 5yr Archive &rarr; Expunge"
            ],
            [
              <span key="p" className="font-semibold text-slate-800">Person Entities (PII)</span>,
              <StatusPill key="pp" tone="danger">Critical Sensitivity</StatusPill>,
              "Restoring Family Links (RFL)",
              "Strictly Restricted by Case Binding",
              <span key="pe" className="font-mono text-xs">Pseudonymized / Vaulted</span>,
              "Mandate limited retention"
            ],
            [
              <span key="a" className="font-semibold text-slate-800">Aggregated Indicators</span>,
              <StatusPill key="ap" tone="info">Medium / Low</StatusPill>,
              "Strategic Resource Planning",
              "Program Managers, Data Officers",
              <span key="ae" className="font-mono text-xs">k-Anonymity (k &ge; 5)</span>,
              "Rolling 24-Month Aggregation"
            ],
            [
              <span key="l" className="font-semibold text-slate-800">System Audit Trail</span>,
              <StatusPill key="lp" tone="warn">Accountability Log</StatusPill>,
              "Forensic Verification & Compliance",
              "Super Admin, Compliance Auditor",
              <span key="le" className="font-mono text-xs">Append-Only Cryptographic Log</span>,
              "7-Year Legal Hold"
            ]
          ]}
        />
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title="Emergency Privacy Mode Mechanics" icon={<EyeOff size={16} className="text-slate-600" />}>
          <div className="text-xs text-slate-700 leading-relaxed flex flex-col gap-2">
            <p className="m-0">
              When field workers operate in contested or compromised environments, <strong>Emergency Privacy Mode</strong> immediately redacts all personally identifiable information (PII), names, and location coordinates from the client screen buffer.
            </p>
            <p className="m-0 text-slate-500">
              Export functionality is globally disabled while Emergency Mode is active to prevent unauthorized physical screen photography or coercion leaks.
            </p>
          </div>
        </Panel>

        <Panel title="Data Minimization Guarantee" icon={<ShieldCheck size={16} className="text-emerald-600" />}>
          <div className="text-xs text-slate-700 leading-relaxed flex flex-col gap-2">
            <p className="m-0">
              In accordance with the <em>Handbook on Data Protection in Humanitarian Action</em>, only non-identifying biometric proxies and minimum necessary operational markers are gathered during initial intake.
            </p>
            <p className="m-0 text-slate-500">
              All records in this demonstration are strictly synthetic and fictional.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
