import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { encryptField, decryptField } from './encryption';

const mockPrisma = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  case: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  caseNote: {
    create: vi.fn()
  },
  consent: {
    create: vi.fn(),
    update: vi.fn()
  },
  familyLink: {
    findMany: vi.fn()
  },
  auditLog: {
    findMany: vi.fn(),
    create: vi.fn()
  }
}));

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      constructor() {
        return mockPrisma;
      }
    }
  };
});

import { app } from './index';

describe('HPIS Server RBAC & Security Hardening Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const generateToken = (role: string, id: string = '00000000-0000-0000-0000-000000000001') => {
    return jwt.sign(
      { sub: id, role, email: `${role.toLowerCase()}@hpis.example` },
      process.env.SUPABASE_JWT_SECRET || 'test-secret-key-do-not-use-in-prod'
    );
  };

  const mockProfile = (role: string) => {
    mockPrisma.$queryRaw.mockResolvedValue([{ role }]);
  };

  describe('Part A: Security Gaps & Auth Hardening', () => {
    it('returns 401 when no token is provided', async () => {
      const res = await request(app).get('/api/cases');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/cases')
        .set('Authorization', 'Bearer invalid-token-string');
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('A2: returns 401 when DB profile is missing (never trusts role claim in token)', async () => {
      const token = generateToken('SUPER_ADMIN'); // Attacker sets custom role claim in token
      mockPrisma.$queryRaw.mockResolvedValue([]); // No row in DB profiles

      const res = await request(app)
        .get('/api/cases')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
      expect(res.body.error.message).toContain('No profile provisioned');
    });
  });

  describe('Part B2: Field-Level AES-256-GCM Encryption', () => {
    it('encrypts and decrypts sensitive strings seamlessly', () => {
      const sensitiveText = 'Confidential protection intake details for displaced family';
      const cipherText = encryptField(sensitiveText);

      expect(cipherText).toBeDefined();
      expect(cipherText).toMatch(/^enc:v1:[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/);
      expect(cipherText).not.toBe(sensitiveText);

      const decrypted = decryptField(cipherText);
      expect(decrypted).toBe(sensitiveText);
    });

    it('handles empty or legacy unencrypted fields gracefully', () => {
      expect(encryptField('')).toBe('');
      expect(encryptField(null)).toBe(null);
      expect(decryptField('plain-text-legacy-string')).toBe('plain-text-legacy-string');
    });
  });

  describe('Part B3: Consent Tracking Endpoints', () => {
    it('allows CASE_WORKER to grant consent for their assigned case', async () => {
      const workerId = '00000000-0000-0000-0000-000000000004';
      const token = generateToken('CASE_WORKER', workerId);
      mockProfile('CASE_WORKER');

      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case-1',
        personId: 'person-1',
        assignedToId: workerId
      });

      mockPrisma.consent.create.mockResolvedValue({
        id: 'consent-1',
        personId: 'person-1',
        purpose: 'Family Tracing',
        scope: 'Cross-border messaging'
      });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app)
        .post('/api/cases/case-1/consents')
        .set('Authorization', `Bearer ${token}`)
        .send({
          purpose: 'Family Tracing',
          scope: 'Cross-border messaging'
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('consent-1');
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });

    it('denies CASE_WORKER from recording consent on unassigned case', async () => {
      const workerId = '00000000-0000-0000-0000-000000000004';
      const token = generateToken('CASE_WORKER', workerId);
      mockProfile('CASE_WORKER');

      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case-99',
        personId: 'person-99',
        assignedToId: 'other-officer-id'
      });

      const res = await request(app)
        .post('/api/cases/case-99/consents')
        .set('Authorization', `Bearer ${token}`)
        .send({
          purpose: 'Medical referral',
          scope: 'Health clinic records'
        });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('allows PROTECTION_OFFICER to revoke consent', async () => {
      const token = generateToken('PROTECTION_OFFICER');
      mockProfile('PROTECTION_OFFICER');

      mockPrisma.consent.update.mockResolvedValue({
        id: 'consent-1',
        revokedAt: new Date().toISOString()
      });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app)
        .patch('/api/consents/consent-1/revoke')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('consent-1');
    });
  });

  describe('Part B4: CaseNote Timeline Endpoints', () => {
    it('allows assigned CASE_WORKER to add a note to their case', async () => {
      const workerId = '00000000-0000-0000-0000-000000000004';
      const token = generateToken('CASE_WORKER', workerId);
      mockProfile('CASE_WORKER');

      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case-1',
        assignedToId: workerId
      });

      mockPrisma.caseNote.create.mockResolvedValue({
        id: 'note-1',
        content: 'Conducted initial psychosocial interview',
        caseId: 'case-1'
      });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app)
        .post('/api/cases/case-1/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Conducted initial psychosocial interview' });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('note-1');
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('Cases Endpoint Permissions & Lifecycle', () => {
    it('allows VIEWER to view cases and creates audit log', async () => {
      const token = generateToken('VIEWER');
      mockProfile('VIEWER');
      mockPrisma.case.findMany.mockResolvedValue([{ id: 'c1', summary: 'Sample case' }]);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app)
        .get('/api/cases')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });

    it('denies VIEWER from creating a case (403)', async () => {
      const token = generateToken('VIEWER');
      mockProfile('VIEWER');

      const res = await request(app)
        .post('/api/cases')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'FAMILY_SEPARATION',
          priority: 'HIGH',
          region: 'Amhara',
          location: 'Gondar',
          summary: 'Case description',
          personId: '00000000-0000-0000-0000-000000000099'
        });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('allows PROTECTION_OFFICER to create a case', async () => {
      const token = generateToken('PROTECTION_OFFICER');
      mockProfile('PROTECTION_OFFICER');
      mockPrisma.case.create.mockResolvedValue({ id: 'new-case-123', summary: 'Encrypted summary' });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app)
        .post('/api/cases')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'FAMILY_SEPARATION',
          priority: 'HIGH',
          region: 'Amhara',
          location: 'Dessie',
          summary: 'Protection case description',
          personId: '00000000-0000-0000-0000-000000000099'
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('new-case-123');
    });

    it('denies AUDITOR from deleting a case (SUPER_ADMIN only)', async () => {
      const token = generateToken('AUDITOR');
      mockProfile('AUDITOR');

      const res = await request(app)
        .delete('/api/cases/c1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('allows SUPER_ADMIN to delete a case', async () => {
      const token = generateToken('SUPER_ADMIN');
      mockProfile('SUPER_ADMIN');
      mockPrisma.case.delete.mockResolvedValue({ id: 'c1' });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app)
        .delete('/api/cases/c1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Audit Logs Permissions', () => {
    it('allows AUDITOR to view audit logs', async () => {
      const token = generateToken('AUDITOR');
      mockProfile('AUDITOR');
      mockPrisma.auditLog.findMany.mockResolvedValue([{ id: 'log1', action: 'VIEW' }]);

      const res = await request(app)
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('denies CASE_WORKER from viewing audit logs', async () => {
      const token = generateToken('CASE_WORKER');
      mockProfile('CASE_WORKER');

      const res = await request(app)
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('HXL Data Export', () => {
    it('allows DATA_OFFICER to export HXL data', async () => {
      const token = generateToken('DATA_OFFICER');
      mockProfile('DATA_OFFICER');
      mockPrisma.case.findMany.mockResolvedValue([
        { id: 'c1', type: 'FAMILY_SEPARATION', priority: 'HIGH', region: 'Tigray', location: 'Mekelle', status: 'NEW', personId: 'p1' }
      ]);
      mockPrisma.auditLog.create.mockResolvedValue({});

      const res = await request(app)
        .get('/api/cases/export/hxl')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('#case+id');
    });

    it('denies VIEWER from exporting HXL data', async () => {
      const token = generateToken('VIEWER');
      mockProfile('VIEWER');

      const res = await request(app)
        .get('/api/cases/export/hxl')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
