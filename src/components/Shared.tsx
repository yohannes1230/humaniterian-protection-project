import React from 'react';
import type { Role } from '../types';
import { ShieldAlert, Inbox, AlertTriangle, Loader2, Home } from 'lucide-react';

export const statusColors: Record<string, string> = {
  LOW: "ok",
  MEDIUM: "info",
  HIGH: "warn",
  CRITICAL: "danger",
  NEW: "info",
  ASSESSMENT: "info",
  INVESTIGATION: "warn",
  REFERRAL: "warn",
  FOLLOW_UP: "info",
  RESOLVED: "ok",
  ARCHIVED: "neutral",
  SUCCESS: "ok",
  DENIED: "danger"
};

export function PageTitle({
  title,
  kicker,
  action
}: {
  title: string;
  kicker?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {kicker && <p className="page-kicker">{kicker}</p>}
        <h1 className="page-title-text">{title}</h1>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
  icon
}: {
  children: React.ReactNode;
  tone?: string;
  icon?: React.ReactNode;
}) {
  return (
    <span className={`status-pill ${tone}`}>
      {icon}
      {children}
    </span>
  );
}

export function Metric({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <span className="metric-hint">{hint}</span>
    </div>
  );
}

export function Panel({
  title,
  icon,
  action,
  children
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          {icon}
          <span>{title}</span>
        </h2>
        {action && <div>{action}</div>}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function DataTable({
  columns,
  rows
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  if (rows.length === 0) {
    return <EmptyState title="No records found" description="No entries match the active criteria or filter parameters." />;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LoadingState({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-3">
      <Loader2 size={24} className="animate-spin text-sky-600" />
      <span className="text-xs font-medium">{message}</span>
    </div>
  );
}

export function EmptyState({
  title = "No data available",
  description = "There are no records to display at this time.",
  action
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-lg my-2">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
        <Inbox size={20} />
      </div>
      <h3 className="text-sm font-semibold text-slate-800 m-0">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-3">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Failed to load information",
  error,
  onRetry
}: {
  title?: string;
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-900">
      <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-bold m-0">{title}</h4>
        {error && <p className="text-xs text-red-700 mt-1 mb-3 font-mono">{error}</p>}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-red-700"
          >
            Retry Request
          </button>
        )}
      </div>
    </div>
  );
}

export function AccessDenied({
  role,
  onNavigateDashboard
}: {
  role: Role;
  onNavigateDashboard?: () => void;
}) {
  return (
    <Panel title="Access Restricted" icon={<ShieldAlert size={18} className="text-amber-600" />}>
      <div className="py-6 px-4 text-center max-w-md mx-auto flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-700 rounded-full flex items-center justify-center">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 m-0">Insufficient Role Permissions</h3>
          <p className="text-xs text-slate-600 mt-1 mb-0 leading-relaxed">
            Your active role (<strong>{role}</strong>) is restricted from accessing this operational module according to the system RBAC policy matrix (<code className="font-mono text-slate-700">docs/rbac-matrix.md</code>).
          </p>
        </div>
        {onNavigateDashboard && (
          <button
            type="button"
            onClick={onNavigateDashboard}
            className="btn-secondary mt-2 text-xs"
          >
            <Home size={14} />
            <span>Return to Operational Dashboard</span>
          </button>
        )}
      </div>
    </Panel>
  );
}
