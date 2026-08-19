import { BarChart3, Activity, FileText } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { regionCounts, caseTrend } from "../data";
import { PageTitle, Metric, Panel, DataTable, StatusPill, statusColors } from "./Shared";
import type { HumanitarianCase } from "../types";
import { translate } from "../i18n";

export function Dashboard({
  t,
  privacyMode,
  localCases
}: {
  t: (key: Parameters<typeof translate>[1]) => string;
  privacyMode: boolean;
  localCases: HumanitarianCase[];
}) {
  const metrics = [
    { label: "Active Cases", value: "1,248", hint: "Across all operational zones" },
    { label: "High Priority", value: "143", hint: "Requires immediate triage" },
    { label: "Family Link Inquiries", value: "327", hint: "Active tracing workflow" },
    { label: "Open Referrals", value: "216", hint: "Inter-agency coordination" },
    { label: "Resolved (30d)", value: "184", hint: "Avg resolution 18.4 days" },
    { label: "Security Events", value: privacyMode ? "Restricted" : "0 Critical", hint: "All systems nominal" }
  ];

  // Restrained institutional color mapping for bar charts
  const barColors = ["#0f2137", "#182f4d", "#0284c7", "#0f766e", "#475569"];

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title={t("dashboard")}
        kicker="Executive Operational Overview & Protection Metrics"
      />

      {/* Top Metric Cards */}
      <div className="metric-grid">
        {metrics.map((m) => (
          <Metric key={m.label} label={m.label} value={m.value} hint={m.hint} />
        ))}
      </div>

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Case Distribution by Operational Region" icon={<BarChart3 size={16} className="text-slate-600" />}>
          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    fontSize: "12px",
                    borderRadius: "6px"
                  }}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {regionCounts.map((entry, index) => (
                    <Cell key={entry.name} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Protection Case Resolution Velocity" icon={<Activity size={16} className="text-slate-600" />}>
          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caseTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#cbd5e1",
                    fontSize: "12px",
                    borderRadius: "6px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cases"
                  name="New Cases"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#0284c7" }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#059669" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Recent Signals Data Table */}
      <Panel
        title="Recent Operational Case Signals"
        icon={<FileText size={16} className="text-slate-600" />}
        action={<a href="/cases" className="text-xs font-semibold text-sky-700 hover:text-sky-900">View Full Docket &rarr;</a>}
      >
        <DataTable
          columns={["Case Identifier", "Category", "Priority", "Status", "Assigned Officer", "Registered Date"]}
          rows={localCases.slice(0, 5).map((caseItem) => [
            <a key={caseItem.id} href={`/cases/${caseItem.id}`} className="font-mono font-semibold text-sky-800">
              {caseItem.id}
            </a>,
            caseItem.type.replace(/_/g, " "),
            <StatusPill key={`${caseItem.id}-pr`} tone={statusColors[caseItem.priority]}>{caseItem.priority}</StatusPill>,
            <StatusPill key={`${caseItem.id}-st`} tone={statusColors[caseItem.status]}>{caseItem.status}</StatusPill>,
            <span key={`${caseItem.id}-off`} className="text-slate-700">{caseItem.assignedOfficer}</span>,
            <span key={`${caseItem.id}-dt`} className="font-mono text-xs text-slate-500">{caseItem.opened}</span>
          ])}
        />
      </Panel>
    </div>
  );
}
