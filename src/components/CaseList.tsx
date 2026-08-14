import { useState } from "react";
import { FileText, Plus, Filter, Download, ArrowLeft } from 'lucide-react';
import { PageTitle, Panel, DataTable, StatusPill, statusColors } from "./Shared";
import type { HumanitarianCase } from "../types";
import { persons } from "../data";

export function CaseList({
  localCases,
  createDemoCase,
  privacyMode
}: {
  localCases: HumanitarianCase[];
  createDemoCase: () => void;
  privacyMode: boolean;
}) {
  const [filterRegion, setFilterRegion] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");

  const filteredCases = localCases.filter((c) => {
    if (filterRegion !== "ALL" && c.region !== filterRegion) return false;
    if (filterPriority !== "ALL" && c.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Protection Case Management"
        kicker="Casework Lifecycle, Referrals & Protection Monitoring"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={createDemoCase}
              className="btn-primary"
            >
              <Plus size={15} />
              <span>Intake New Case</span>
            </button>
          </div>
        }
      />

      {/* Filter / Triage Toolbar */}
      <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <span className="font-semibold text-slate-700">Filters:</span>
          
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
            aria-label="Filter by region"
          >
            <option value="ALL">All Regions</option>
            <option value="Amhara">Amhara</option>
            <option value="Tigray">Tigray</option>
            <option value="Oromia">Oromia</option>
            <option value="Afar">Afar</option>
            <option value="Somali">Somali</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
            aria-label="Filter by priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono">
            Showing {filteredCases.length} of {localCases.length} records
          </span>
        </div>
      </div>

      {/* Main Cases Table Panel */}
      <Panel
        title="Active Protection Docket"
        icon={<FileText size={16} className="text-slate-600" />}
      >
        <DataTable
          columns={["Case Identifier", "Person Record", "Category", "Region / Zone", "Priority", "Status", "Assigned Officer", "Action"]}
          rows={filteredCases.map((caseItem) => {
            const person = persons.find((item) => item.id === caseItem.personId);
            return [
              <span key={caseItem.id} className="font-mono font-semibold text-sky-800">{caseItem.id}</span>,
              privacyMode ? (
                <span key={`${caseItem.id}-p`} className="font-mono text-slate-400">REDACTED</span>
              ) : (
                <span key={`${caseItem.id}-p`} className="font-medium text-slate-800">{person?.pseudonym ?? "Unknown"}</span>
              ),
              caseItem.type.replace(/_/g, " "),
              caseItem.region,
              <StatusPill key={`${caseItem.id}-pr`} tone={statusColors[caseItem.priority]}>{caseItem.priority}</StatusPill>,
              <StatusPill key={`${caseItem.id}-st`} tone={statusColors[caseItem.status]}>{caseItem.status}</StatusPill>,
              <span key={`${caseItem.id}-off`} className="text-slate-700">{caseItem.assignedOfficer}</span>,
              <a
                key={`${caseItem.id}-lnk`}
                href={`/cases/${caseItem.id}`}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900"
              >
                View Dossier
              </a>
            ];
          })}
        />
      </Panel>
    </div>
  );
}

export function CaseForm({
  createDemoCase,
  online
}: {
  createDemoCase: () => void;
  online: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <PageTitle
        title="Intake New Protection Case"
        kicker={online ? "Standard Intake Protocol" : "Offline Resilient Cache Active"}
        action={
          <a href="/cases" className="btn-secondary text-xs">
            <ArrowLeft size={14} />
            <span>Return to Case List</span>
          </a>
        }
      />

      <Panel title="Intake Form" icon={<FileText size={16} className="text-slate-600" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Case Category</label>
            <select className="form-input" defaultValue="FAMILY_SEPARATION">
              <option value="FAMILY_SEPARATION">Family Separation / Tracing</option>
              <option value="UNACCOMPANIED_MINOR">Unaccompanied Minor</option>
              <option value="MEDICAL_EMERGENCY">Medical Referral Priority</option>
              <option value="LEGAL_PROTECTION">Legal & Documentation Protection</option>
            </select>
          </div>

          <div>
            <label className="form-label">Priority Triage</label>
            <select className="form-input" defaultValue="HIGH">
              <option value="CRITICAL">Critical (Immediate Response &lt; 24h)</option>
              <option value="HIGH">High (Response &lt; 48h)</option>
              <option value="MEDIUM">Medium (Standard Workflow)</option>
              <option value="LOW">Low (Monitoring)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Administrative Region</label>
            <input type="text" className="form-input" defaultValue="Amhara" />
          </div>

          <div>
            <label className="form-label">Zone / Camp Location</label>
            <input type="text" className="form-input" defaultValue="North Wollo Field Post" />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Case Summary & Protection Assessment</label>
            <textarea
              className="form-input"
              rows={3}
              defaultValue="Protection intake initiated during field monitoring. Minimal identifiers captured in strict accordance with data minimization principles."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <a href="/cases" className="btn-secondary">Cancel</a>
          <button type="button" onClick={createDemoCase} className="btn-primary">
            <span>Commit Case Record</span>
          </button>
        </div>
      </Panel>
    </div>
  );
}
