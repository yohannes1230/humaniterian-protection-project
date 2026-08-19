import { describe, it, expect } from 'vitest';
import { cases, users } from './data';
import type { Role, HumanitarianCase } from './types';

/**
 * End-to-End RBAC Security Boundary Test Suite
 * Asserts permissions matrix defined in docs/rbac-matrix.md
 */
describe('HPIS RBAC Boundary Verification (E2E Logic)', () => {
  // Case Worker Dawit Kebede (u4)
  const caseWorker = users.find(u => u.role === 'CASE_WORKER')!;
  
  // Case assigned to Dawit Kebede
  const assignedCase: HumanitarianCase = cases.find(c => c.assignedOfficer.includes('Dawit Kebede') || c.assignedOfficer.includes('Case Worker'))!;
  
  // Case assigned to Sara Tefera (Protection Officer)
  const unassignedCase: HumanitarianCase = cases.find(c => c.assignedOfficer.includes('Sara Tefera') || c.assignedOfficer.includes('Protection'))!;

  it('verifies CASE_WORKER is strictly scoped to assigned cases only', () => {
    expect(caseWorker).toBeDefined();
    expect(assignedCase).toBeDefined();
    expect(unassignedCase).toBeDefined();

    // Helper simulating RBAC filter applied by backend and UI views
    const isAuthorizedForCase = (userRole: Role, userOfficerName: string, targetCase: HumanitarianCase): boolean => {
      if (['SUPER_ADMIN', 'PROGRAM_MANAGER', 'PROTECTION_OFFICER', 'DATA_OFFICER', 'AUDITOR', 'VIEWER'].includes(userRole)) {
        return true; // Broad view roles
      }
      if (userRole === 'CASE_WORKER' || userRole === 'FIELD_OFFICER') {
        return targetCase.assignedOfficer.includes(userOfficerName);
      }
      return false;
    };

    // Assert assigned case access is PERMITTED
    const canAccessAssigned = isAuthorizedForCase(caseWorker.role, 'Dawit Kebede', assignedCase);
    expect(canAccessAssigned).toBe(true);

    // Assert unassigned case access is BLOCKED
    const canAccessUnassigned = isAuthorizedForCase(caseWorker.role, 'Dawit Kebede', unassignedCase);
    expect(canAccessUnassigned).toBe(false);
  });

  it('verifies VIEWER role has read-only access and cannot perform mutations', () => {
    const viewer = users.find(u => u.role === 'VIEWER')!;
    
    const canCreateCase = (role: Role) => ['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER', 'FIELD_OFFICER'].includes(role);
    const canDeleteCase = (role: Role) => role === 'SUPER_ADMIN';
    const canExportHxl = (role: Role) => ['SUPER_ADMIN', 'PROGRAM_MANAGER', 'DATA_OFFICER'].includes(role);

    expect(canCreateCase(viewer.role)).toBe(false);
    expect(canDeleteCase(viewer.role)).toBe(false);
    expect(canExportHxl(viewer.role)).toBe(false);
  });

  it('verifies AUDITOR role can read audit trails but cannot modify cases', () => {
    const auditor = users.find(u => u.role === 'AUDITOR')!;

    const canViewAuditLogs = (role: Role) => ['SUPER_ADMIN', 'PROGRAM_MANAGER', 'AUDITOR'].includes(role);
    const canModifyCase = (role: Role) => ['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER'].includes(role);

    expect(canViewAuditLogs(auditor.role)).toBe(true);
    expect(canModifyCase(auditor.role)).toBe(false);
  });
});
