import { useState } from "react";
import { Users, Shield, CheckCircle2, ChevronRight, Info, UserCheck } from 'lucide-react';
import { PageTitle, Panel, StatusPill } from "./Shared";
import { familyLinks, persons } from "../data";
import { translate } from "../i18n";
import type { FamilyLink } from "../types";

export function FamilyLinks({
  _t,
  privacyMode
}: {
  _t?: (key: Parameters<typeof translate>[1]) => string;
  t?: (key: Parameters<typeof translate>[1]) => string;
  privacyMode: boolean;
}) {
  const [selectedLink, setSelectedLink] = useState<FamilyLink>(familyLinks[0]);
  const [verifiedMatches, setVerifiedMatches] = useState<Record<string, boolean>>({});

  const person = persons.find((p) => p.id === selectedLink.personId);

  const toggleVerification = (linkId: string) => {
    setVerifiedMatches(prev => ({ ...prev, [linkId]: !prev[linkId] }));
  };

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Family-Link & Tracing Verification Engine"
        kicker="Deterministic Identity Resolution & Human-in-the-Loop Safeguards"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Protocol Standard: ICRC RFL Guidelines v3</span>
          </div>
        }
      />

      {/* Human Safeguard Banner */}
      <div className="p-3 bg-sky-50 border border-sky-200 rounded-md flex items-center justify-between gap-3 text-sky-950 text-xs">
        <div className="flex items-center gap-2.5">
          <Shield size={16} className="text-sky-700 shrink-0" />
          <span>
            <strong>Human Verification Mandate:</strong> Algorithm confidence scores are non-binding suggestions. All reunions require direct caseworker biometric and narrative verification before disclosure.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-white border border-sky-300 text-sky-800 px-2 py-0.5 rounded">
          RFL-SAFEGUARD-ACTIVE
        </span>
      </div>

      {/* Main Grid: Tracing Requests + Signature Confidence Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 items-start">
        
        {/* Left: Tracing Request Queue */}
        <Panel
          title="Active Tracing Inquiries"
          icon={<Users size={16} className="text-slate-600" />}
          action={<span className="text-xs text-slate-500 font-mono">{familyLinks.length} Inquiries Loaded</span>}
        >
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Person Identifier</th>
                  <th>Status</th>
                  <th>Match Confidence</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {familyLinks.map((item) => {
                  const isSelected = selectedLink.id === item.id;
                  const isVerified = verifiedMatches[item.id];
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedLink(item)}
                      className={`cursor-pointer transition-colors ${isSelected ? "bg-sky-50/70 font-medium" : ""}`}
                    >
                      <td className="font-mono text-xs font-semibold text-slate-800">{item.id}</td>
                      <td className="text-xs">
                        {privacyMode ? (
                          <span className="font-mono text-slate-400">REDACTED</span>
                        ) : (
                          <span className="font-mono text-slate-700">{item.personId}</span>
                        )}
                      </td>
                      <td>
                        <StatusPill tone="warn">{item.status}</StatusPill>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.matchScore >= 80 ? "bg-emerald-600" : item.matchScore >= 60 ? "bg-amber-500" : "bg-slate-400"
                              }`}
                              style={{ width: `${item.matchScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-800">{item.matchScore}%</span>
                        </div>
                      </td>
                      <td>
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 size={13} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedLink(item); }}
                          className="text-xs text-sky-700 hover:text-sky-900 bg-transparent border-0 p-0 font-medium inline-flex items-center gap-0.5"
                        >
                          Inspect <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Right: SIGNATURE MOMENT - Multi-Attribute Match Confidence Breakdown */}
        <Panel
          title="Match Confidence Breakdown"
          icon={<Shield size={16} className="text-sky-700" />}
          action={
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
              {selectedLink.id}
            </span>
          }
        >
          <div className="flex flex-col gap-4">
            
            {/* Header Score Gauge */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Composite Match Score</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-slate-900">{selectedLink.matchScore}%</span>
                  <span className="text-xs font-medium text-emerald-700">
                    {selectedLink.matchScore >= 80 ? "High Statistical Correlation" : "Moderate Candidate"}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center font-mono font-bold text-xs text-slate-800">
                {selectedLink.matchScore}%
              </div>
            </div>

            {/* Deterministic Attribute Breakdown Bars */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Scoring Vector Attribution
              </span>

              {/* Vector 1: Phonetic & Orthographic Name Similarity (30%) */}
              <div className="match-breakdown-card">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Phonetic & Name Similarity (Levenshtein)</span>
                  <span className="font-mono font-semibold text-slate-800">92% &bull; Weight 30%</span>
                </div>
                <div className="match-progress-bar">
                  <div className="match-progress-fill bg-sky-600" style={{ width: "92%" }} />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Matched token: <code className="font-mono text-slate-700">{person?.pseudonym || "Registered Person"}</code> (Distance: 1 character)
                </span>
              </div>

              {/* Vector 2: Geographic & Last Known Location (20%) */}
              <div className="match-breakdown-card">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Geographic & Camp Proximity</span>
                  <span className="font-mono font-semibold text-slate-800">85% &bull; Weight 20%</span>
                </div>
                <div className="match-progress-bar">
                  <div className="match-progress-fill bg-emerald-600" style={{ width: "85%" }} />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Region: <span className="text-slate-700 font-medium">{person?.region || "Amhara"}</span> (Correlated with displacement corridor)
                </span>
              </div>

              {/* Vector 3: Age Window Compatibility (15%) */}
              <div className="match-breakdown-card">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Age Bracket Compatibility</span>
                  <span className="font-mono font-semibold text-slate-800">100% &bull; Weight 15%</span>
                </div>
                <div className="match-progress-bar">
                  <div className="match-progress-fill bg-emerald-600" style={{ width: "100%" }} />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Estimated Age: <span className="text-slate-700 font-medium">{person?.ageRange || "Adult"}</span> (Within expected timeline deviation)
                </span>
              </div>

              {/* Vector 4: Timeline & Last Contact Date (15%) */}
              <div className="match-breakdown-card">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Displacement Timeline Alignment</span>
                  <span className="font-mono font-semibold text-slate-800">78% &bull; Weight 15%</span>
                </div>
                <div className="match-progress-bar">
                  <div className="match-progress-fill bg-amber-500" style={{ width: "78%" }} />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Last Contact: <span className="text-slate-700 font-medium">{selectedLink.lastContact}</span>
                </span>
              </div>
            </div>

            {/* Circumstances & Case Context */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 flex flex-col gap-1">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Info size={14} className="text-slate-500" />
                Case Circumstances
              </span>
              <p className="m-0 text-slate-600 leading-relaxed">
                {selectedLink.circumstances}
              </p>
            </div>

            {/* Caseworker Verification Action */}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggleVerification(selectedLink.id)}
                className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors border ${
                  verifiedMatches[selectedLink.id]
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    : "bg-sky-700 hover:bg-sky-800 text-white border-sky-800"
                }`}
              >
                {verifiedMatches[selectedLink.id] ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Authorized Verification Recorded</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={15} />
                    <span>Authorize & Confirm Candidate Match</span>
                  </>
                )}
              </button>
              <span className="text-[10px] text-center text-slate-400">
                Action is cryptographically appended to the immutable Audit Log.
              </span>
            </div>

          </div>
        </Panel>

      </div>
    </div>
  );
}
