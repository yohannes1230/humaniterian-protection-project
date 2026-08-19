export type Role =
  | "SUPER_ADMIN"
  | "PROGRAM_MANAGER"
  | "PROTECTION_OFFICER"
  | "CASE_WORKER"
  | "DATA_OFFICER"
  | "FIELD_OFFICER"
  | "AUDITOR"
  | "VIEWER";

export type CaseStatus =
  | "NEW"
  | "ASSESSMENT"
  | "INVESTIGATION"
  | "REFERRAL"
  | "FOLLOW_UP"
  | "RESOLVED"
  | "ARCHIVED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  mfaEnabled: boolean;
}

export interface Consent {
  id: string;
  personId: string;
  purpose: string;
  scope: string;
  grantedAt: string;
  revokedAt?: string | null;
  grantedByUserId: string;
}

export interface Person {
  id: string;
  pseudonym: string;
  ageRange: string;
  sex: "Female" | "Male" | "Unknown";
  region: string;
  lastKnownLocation: string;
  verificationStatus: "Verified" | "Unverified" | "Pending";
  restrictedName?: string;
  consents?: Consent[];
}

export interface HumanitarianCase {
  id: string;
  type: string;
  priority: Priority;
  region: string;
  location: string;
  status: CaseStatus;
  assignedOfficer: string;
  opened: string;
  updated: string;
  personId: string;
  summary: string;
  notes: string[];
}

export interface FamilyLink {
  id: string;
  caseId: string;
  personId: string;
  status: string;
  lastContact: string;
  circumstances: string;
  matchScore: number;
}

export interface Referral {
  id: string;
  caseId: string;
  category: string;
  organization: string;
  priority: Priority;
  date: string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
  outcome: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  result: "SUCCESS" | "DENIED";
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  timestamp: string;
  status: string;
}

export interface ServicePoint {
  id: string;
  name: string;
  category: string;
  region: string;
  lat: number;
  lng: number;
  hours: string;
  services: string;
}
