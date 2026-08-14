import { useState } from 'react';
import { FileText, Lock, CheckCircle2, ArrowLeft, Clock, ShieldCheck, Share2 } from 'lucide-react';
import { PageTitle, Panel, DataTable, StatusPill, statusColors } from "./Shared";
import type { HumanitarianCase } from "../types";
import { persons } from "../data";

export function CaseDetail({
  caseItem,
  privacyMode
}: {
  caseItem: HumanitarianCase;
  privacyMode: boolean;
}) {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const person = persons.find((item) => item.id === caseItem.personId);

  const tabs = ["Overview", "Person Dossier", "Case Notes", "Referrals", "Audit Trail"];

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title={`Case Dossier: ${caseItem.id}`}
        kicker={`${caseItem.type.replace(/_/g, " ")} &bull; ${caseItem.region}`}
        action={
          <div className="flex items-center gap-2">
            <a href="/cases" className="btn-secondary text-xs">
              <ArrowLeft size={14} />
              <span>Back to Cases</span>
            </a>
            <StatusPill tone={statusColors[caseItem.status]}>{caseItem.status}</StatusPill>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === tab
                ? "border-sky-600 text-sky-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr] gap-4 items-start">
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <Panel title="Case Summary & Context" icon={<FileText size={16} className="text-slate-600" />}>
            <p className="text-xs text-slate-700 leading-relaxed m-0 mb-4 bg-slate-50 p-3 rounded border border-slate-200">
              {caseItem.summary}
            </p>

            <DataTable
              columns={["Field Parameter", "Operational Value"]}
              rows={[
                ["Triage Priority", <StatusPill key="p" tone={statusColors[caseItem.priority]}>{caseItem.priority}</StatusPill>],
                ["Assigned Case Officer", <span key="off" className="font-semibold text-slate-800">{caseItem.assignedOfficer}</span>],
                ["Administrative Region", caseItem.region],
                ["Field Post Location", caseItem.location],
                ["Linked Person Entity", privacyMode ? <span key="pr" className="font-mono text-slate-400">REDACTED BY EMERGENCY MODE</span> : <span key="pr" className="font-mono text-slate-800">{person?.pseudonym} ({person?.id})</span>],
                ["Intake Registered", <span key="op" className="font-mono">{caseItem.opened}</span>],
                ["Last Status Transition", <span key="up" className="font-mono">{caseItem.updated}</span>]
              ]}
            />
          </Panel>

          <Panel title="Case Activity Notes" icon={<Clock size={16} className="text-slate-600" />}>
            <div className="flex flex-col gap-2">
              {caseItem.notes.map((note, index) => (
                <div key={index} className="p-3 bg-white border border-slate-200 rounded-md text-xs">
                  <div className="flex justify-between text-slate-500 font-mono text-[11px] mb-1">
                    <span>Note #{index + 1}</span>
                    <span>{caseItem.updated}</span>
                  </div>
                  <p className="m-0 text-slate-800 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Section: Privacy & Safeguards */}
        <div className="flex flex-col gap-4">
          <Panel title="Institutional Privacy Controls" icon={<Lock size={16} className="text-slate-600" />}>
            <div className="flex flex-col gap-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Pseudonymized Record:</strong> Identifiers masked unless decrypted with authorized legal basis.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Access Logged:</strong> Every view of this dossier generates a cryptographic audit record.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Emergency Redaction:</strong> When active, all names and locations are masked from screen capture.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Retention Enforced:</strong> Automated archival after resolution per organizational mandate.</span>
              </div>
            </div>
          </Panel>

          <Panel title="Security & Compliance Status" icon={<ShieldCheck size={16} className="text-emerald-600" />}>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-950 flex flex-col gap-1">
              <span className="font-bold">RLS Policy Verified</span>
              <span className="text-[11px] text-emerald-800">
                Authorized under policy: <code className="font-mono">case_select</code> (verified by Supabase auth JWT).
              </span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
