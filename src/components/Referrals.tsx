import { BriefcaseMedical } from 'lucide-react';
import { PageTitle, Panel, DataTable, StatusPill, statusColors } from "./Shared";
import { referrals } from "../data";

export function Referrals() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Inter-Agency Referral Pathways"
        kicker="Specialized Protection Referrals & Partner Handoff Workflow"
      />
      <Panel title="Active Referral Queue" icon={<BriefcaseMedical size={16} className="text-slate-600" />}>
        <DataTable
          columns={["Referral ID", "Case Binding", "Service Domain", "Partner Organization", "Priority", "Status", "Outcome / Disposition"]}
          rows={referrals.map((item) => [
            <span key={item.id} className="font-mono font-semibold text-sky-800">{item.id}</span>,
            <span key={`${item.id}-c`} className="font-mono text-slate-700">{item.caseId}</span>,
            item.category,
            <span key={`${item.id}-o`} className="font-medium text-slate-800">{item.organization}</span>,
            <StatusPill key={item.id} tone={statusColors[item.priority]}>{item.priority}</StatusPill>,
            <StatusPill key={`${item.id}-st`} tone={item.status === "COMPLETED" ? "ok" : "info"}>{item.status}</StatusPill>,
            <span key={`${item.id}-out`} className="text-xs text-slate-600">{item.outcome}</span>
          ])}
        />
      </Panel>
    </div>
  );
}
