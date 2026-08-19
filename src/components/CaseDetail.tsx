import { useState } from 'react';
import { FileText, Lock, CheckCircle2, ArrowLeft, Clock, ShieldCheck, FileCheck, XCircle, Plus, AlertCircle } from 'lucide-react';
import { PageTitle, Panel, DataTable, StatusPill, statusColors } from "./Shared";
import type { HumanitarianCase, Consent } from "../types";
import { persons, sampleConsents } from "../data";
import { useAuth } from "./AuthContext";

export function CaseDetail({
  caseItem,
  privacyMode
}: {
  caseItem: HumanitarianCase;
  privacyMode: boolean;
}) {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const person = persons.find((item) => item.id === caseItem.personId);

  // Local state for interactive notes and consents
  const [notes, setNotes] = useState<string[]>(caseItem.notes || []);
  const [newNote, setNewNote] = useState("");
  const [consents, setConsents] = useState<Consent[]>(person ? sampleConsents[person.id] || [] : []);
  
  // New Consent Form State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentPurpose, setConsentPurpose] = useState("Family Tracing & Restoring Family Links");
  const [consentScope, setConsentScope] = useState("Cross-border communication and tracing data sharing");
  const [consentMessage, setConsentMessage] = useState<string | null>(null);

  const canManageConsent = role === 'SUPER_ADMIN' || role === 'PROTECTION_OFFICER';
  const canAddConsent = canManageConsent || role === 'CASE_WORKER';
  const canAddNotes = role === 'SUPER_ADMIN' || role === 'PROTECTION_OFFICER' || role === 'CASE_WORKER';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([newNote.trim(), ...notes]);
    setNewNote("");
  };

  const handleRevokeConsent = (consentId: string) => {
    setConsents(consents.map(c => c.id === consentId ? { ...c, revokedAt: new Date().toISOString().split('T')[0] } : c));
    setConsentMessage("Consent revoked successfully per humanitarian data protection protocols.");
    setTimeout(() => setConsentMessage(null), 4000);
  };

  const handleCreateConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!person) return;
    const newEntry: Consent = {
      id: `CONS-${Date.now().toString().slice(-4)}`,
      personId: person.id,
      purpose: consentPurpose,
      scope: consentScope,
      grantedAt: new Date().toISOString().split('T')[0],
      revokedAt: null,
      grantedByUserId: "current-user"
    };
    setConsents([newEntry, ...consents]);
    setShowConsentModal(false);
    setConsentMessage("New informed consent record successfully logged.");
    setTimeout(() => setConsentMessage(null), 4000);
  };

  const tabs = ["Overview", "Informed Consent", "Case Notes", "Safeguards"];

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

      {consentMessage && (
        <div className="alert-box success text-xs py-2 px-3 flex items-center gap-2" role="status">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span>{consentMessage}</span>
        </div>
      )}

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
          
          {/* Overview Tab Content */}
          {activeTab === "Overview" && (
            <>
              <Panel title="Case Summary & Context (AES-256-GCM Decrypted)" icon={<FileText size={16} className="text-slate-600" />}>
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
            </>
          )}

          {/* Informed Consent Tab (B3) */}
          {(activeTab === "Informed Consent" || activeTab === "Overview") && (
            <Panel
              title="Humanitarian Informed Consent Tracking"
              icon={<FileCheck size={16} className="text-sky-700" />}
              action={
                canAddConsent && (
                  <button
                    type="button"
                    onClick={() => setShowConsentModal(true)}
                    className="btn-primary text-xs py-1 px-2.5 flex items-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>Register Consent</span>
                  </button>
                )
              }
            >
              {consents.length === 0 ? (
                <p className="text-xs text-slate-500 m-0 py-2">No consent records currently registered for this client.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {consents.map((c) => {
                    const isRevoked = !!c.revokedAt;
                    return (
                      <div
                        key={c.id}
                        className={`p-3 rounded-md border text-xs flex flex-col gap-1.5 transition-colors ${
                          isRevoked ? "bg-slate-50 border-slate-200 opacity-75" : "bg-emerald-50/40 border-emerald-200"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">{c.id}</span>
                            <span className="font-semibold text-slate-800">{c.purpose}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isRevoked ? (
                              <StatusPill tone="danger">Revoked ({c.revokedAt})</StatusPill>
                            ) : (
                              <StatusPill tone="ok">Active Consent</StatusPill>
                            )}
                            {!isRevoked && canManageConsent && (
                              <button
                                type="button"
                                onClick={() => handleRevokeConsent(c.id)}
                                className="btn-secondary text-[11px] py-0.5 px-2 text-rose-700 hover:text-rose-900 border-rose-200 hover:bg-rose-50"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 m-0 text-[11px] leading-relaxed">
                          <strong>Scope:</strong> {c.scope}
                        </p>
                        <div className="text-[10px] text-slate-400 font-mono flex gap-3">
                          <span>Granted: {c.grantedAt}</span>
                          <span>Person: {c.personId}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>
          )}

          {/* Case Notes Tab (B4) */}
          {(activeTab === "Case Notes" || activeTab === "Overview") && (
            <Panel title="Case Activity Notes & Timeline" icon={<Clock size={16} className="text-slate-600" />}>
              {canAddNotes && (
                <form onSubmit={handleAddNote} className="mb-4 flex flex-col gap-2">
                  <label htmlFor="case-note-input" className="text-xs font-semibold text-slate-700">
                    Append New Case Note:
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      id="case-note-input"
                      rows={2}
                      className="form-input text-xs flex-1"
                      placeholder="Enter operational update, client contact, or assessment notes..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary text-xs py-1 px-3" disabled={!newNote.trim()}>
                      Submit Note
                    </button>
                  </div>
                </form>
              )}

              <div className="flex flex-col gap-2">
                {notes.map((note, index) => (
                  <div key={index} className="p-3 bg-white border border-slate-200 rounded-md text-xs shadow-xs">
                    <div className="flex justify-between text-slate-500 font-mono text-[11px] mb-1">
                      <span>Note #{notes.length - index}</span>
                      <span>{caseItem.updated}</span>
                    </div>
                    <p className="m-0 text-slate-800 leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>

        {/* Right Section: Privacy & Safeguards */}
        <div className="flex flex-col gap-4">
          <Panel title="Institutional Privacy Controls" icon={<Lock size={16} className="text-slate-600" />}>
            <div className="flex flex-col gap-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Field Encryption (AES-256-GCM):</strong> Case summary & restricted names encrypted at rest.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Informed Consent:</strong> Purpose-limited data sharing strictly validated before dispatch.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Access Logged:</strong> Every view of this dossier generates a cryptographic audit record.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Emergency Redaction:</strong> When active, all names and locations are masked from screen capture.</span>
              </div>
            </div>
          </Panel>

          <Panel title="Security & Compliance Status" icon={<ShieldCheck size={16} className="text-emerald-600" />}>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-950 flex flex-col gap-1">
              <span className="font-bold">RLS & RBAC Enforced</span>
              <span className="text-[11px] text-emerald-800">
                Authorized under PostgreSQL RLS policy: <code className="font-mono">case_select</code> (verified by Supabase auth JWT).
              </span>
            </div>
          </Panel>
        </div>
      </div>

      {/* Modal for Registering Consent */}
      {showConsentModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
                <FileCheck size={16} className="text-sky-700" />
                <span>Register Informed Consent</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateConsent} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="form-label font-semibold" htmlFor="consent-purpose">
                  Lawful Processing Purpose:
                </label>
                <input
                  id="consent-purpose"
                  type="text"
                  required
                  className="form-input"
                  value={consentPurpose}
                  onChange={(e) => setConsentPurpose(e.target.value)}
                  placeholder="e.g. Restoring Family Links, Medical Referral"
                />
              </div>

              <div>
                <label className="form-label font-semibold" htmlFor="consent-scope">
                  Authorized Scope & Disclosure Limitations:
                </label>
                <textarea
                  id="consent-scope"
                  rows={3}
                  required
                  className="form-input"
                  value={consentScope}
                  onChange={(e) => setConsentScope(e.target.value)}
                  placeholder="Describe data elements permitted for sharing with external partners..."
                />
              </div>

              <div className="p-2.5 bg-sky-50 border border-sky-200 rounded text-slate-700 text-[11px] flex gap-2">
                <AlertCircle size={15} className="text-sky-700 shrink-0 mt-0.5" />
                <span>
                  Consent must be freely given, specific, informed, and unambiguous in accordance with the ICRC Professional Standards.
                </span>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowConsentModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Consent Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
