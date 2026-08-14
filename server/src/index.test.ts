import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const mockPrisma = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  case: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
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

describe('HPIS Server RBAC & Auth Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const generateToken = (role: string, id: string = '00000000-0000-0000-0000-000000000001') => {
    return jwt.sign({ sub: id, role, email: `${role.toLowerCase()}@hpis.example` }, process.env.SUPABASE_SECRET_KEY || 'default-secret-change-me');
  };

  const mockProfile = (role: string) => {
    mockPrisma.$queryRaw.mockResolvedValue([{ role }]);
  };

  describe('JWT Verification & Auth Headers', () => {
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
  });

  describe('Cases Endpoint Permissions', () => {
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
      mockPrisma.case.create.mockResolvedValue({ id: 'new-case-123' });
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
