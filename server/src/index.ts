import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------
// Authentication & RBAC Middleware
// ----------------------------------------------------------------------
export const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing authentication token' } });
  }

  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.SUPABASE_SECRET_KEY || 'default-secret-change-me';
    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
    
    const userId = decoded.sub || (decoded as any).id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token payload' } });
    }

    // Lookup authoritative role from database profiles table (defense-in-depth)
    const profile = await prisma.$queryRaw<[{ role: string }]>`SELECT role FROM profiles WHERE id = ${userId}::uuid`;
    
    if (!profile || profile.length === 0) {
      // If user profile is not found in DB, fallback to token role or reject
      const fallbackRole = (decoded as any).role || 'VIEWER';
      (req as any).user = { id: userId, role: fallbackRole, email: decoded.email };
      return next();
    }

    (req as any).user = { id: userId, role: profile[0].role, email: decoded.email };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Invalid or expired token' } });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Role ${user?.role || 'UNKNOWN'} does not have permission to perform this action`
        }
      });
    }
    next();
  };
};

// ----------------------------------------------------------------------
// Validation Schemas
// ----------------------------------------------------------------------
const createCaseSchema = z.object({
  type: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  region: z.string().min(1),
  location: z.string().min(1),
  summary: z.string().min(1),
  personId: z.string().min(1)
});

const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'ASSESSMENT', 'INVESTIGATION', 'REFERRAL', 'FOLLOW_UP', 'RESOLVED', 'ARCHIVED'])
});

// ----------------------------------------------------------------------
// Public / Health Endpoints
// ----------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ----------------------------------------------------------------------
// Cases Endpoints (RBAC Enforced)
// ----------------------------------------------------------------------
app.get('/api/cases', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    let query: any = { include: { person: true } };

    // Scoped queries based on RBAC matrix:
    // CASE_WORKER and FIELD_OFFICER only see cases assigned to them
    if (user.role === 'CASE_WORKER' || user.role === 'FIELD_OFFICER') {
      query.where = { assignedToId: user.id };
    }

    const cases = await prisma.case.findMany(query);
    
    // Audit Log entry
    await prisma.auditLog.create({
      data: {
        action: 'VIEW',
        resource: 'Case:list',
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch cases' } });
  }
});

app.post('/api/cases', authenticateToken, requireRole(['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER', 'FIELD_OFFICER']), async (req, res) => {
  try {
    const validatedData = createCaseSchema.parse(req.body);
    const user = (req as any).user;
    
    const newCase = await prisma.case.create({
      data: {
        ...validatedData,
        assignedToId: user.role === 'CASE_WORKER' ? user.id : undefined
      }
    });
    
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: `Case:${newCase.id}`,
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.status(201).json(newCase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create case' } });
  }
});

app.patch('/api/cases/:id/status', authenticateToken, requireRole(['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER']), async (req, res) => {
  const validTransitions: Record<string, string[]> = {
    'NEW': ['ASSESSMENT', 'ARCHIVED'],
    'ASSESSMENT': ['INVESTIGATION', 'REFERRAL', 'RESOLVED', 'ARCHIVED'],
    'INVESTIGATION': ['FOLLOW_UP', 'RESOLVED', 'ARCHIVED'],
    'REFERRAL': ['FOLLOW_UP', 'RESOLVED', 'ARCHIVED'],
    'FOLLOW_UP': ['RESOLVED', 'ARCHIVED'],
    'RESOLVED': ['ARCHIVED'],
    'ARCHIVED': []
  };

  try {
    const { status } = updateStatusSchema.parse(req.body);
    const existingCase = await prisma.case.findUnique({ where: { id: req.params.id } });
    
    if (!existingCase) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case not found' } });
    }
    
    // CASE_WORKER can only modify assigned cases
    const user = (req as any).user;
    if (user.role === 'CASE_WORKER' && existingCase.assignedToId !== user.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Case worker can only update assigned cases' } });
    }

    if (!validTransitions[existingCase.status].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TRANSITION', message: `Cannot transition case status from ${existingCase.status} to ${status}` }
      });
    }

    const updatedCase = await prisma.case.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_STATUS',
        resource: `Case:${updatedCase.id}`,
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.json(updatedCase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update case status' } });
  }
});

// Delete/Archive case: SUPER_ADMIN only
app.delete('/api/cases/:id', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const user = (req as any).user;
    await prisma.case.delete({ where: { id: req.params.id } });
    
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        resource: `Case:${req.params.id}`,
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.json({ success: true, message: 'Case deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete case' } });
  }
});

// Export HXL
app.get('/api/cases/export/hxl', authenticateToken, requireRole(['SUPER_ADMIN', 'PROGRAM_MANAGER', 'DATA_OFFICER']), async (req, res) => {
  try {
    const user = (req as any).user;
    const cases = await prisma.case.findMany({ include: { person: true } });
    
    const headers = ['Case ID', 'Type', 'Priority', 'Region', 'Location', 'Status', 'Person ID'];
    const hxlTags = ['#case+id', '#indicator+type', '#priority', '#region', '#loc+name', '#status', '#person+id'];
    
    const rows = cases.map(c => [
      c.id,
      c.type,
      c.priority,
      c.region,
      c.location,
      c.status,
      c.personId
    ]);
    
    const csvContent = [
      headers.join(','),
      hxlTags.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    await prisma.auditLog.create({
      data: {
        action: 'EXPORT',
        resource: 'Case:hxl',
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="cases_hxl.csv"');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to export cases' } });
  }
});

// ----------------------------------------------------------------------
// Family Links & Matching Endpoints
// ----------------------------------------------------------------------
app.get('/api/family-links', authenticateToken, requireRole(['SUPER_ADMIN', 'PROGRAM_MANAGER', 'PROTECTION_OFFICER', 'DATA_OFFICER', 'AUDITOR', 'CASE_WORKER']), async (req, res) => {
  try {
    const user = (req as any).user;
    let query: any = { include: { person: true, case: true } };

    if (user.role === 'CASE_WORKER') {
      query.where = { case: { assignedToId: user.id } };
    }

    const links = await prisma.familyLink.findMany(query);
    res.json(links);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch family links' } });
  }
});

// ----------------------------------------------------------------------
// Audit Logs Endpoint
// ----------------------------------------------------------------------
app.get('/api/audit-logs', authenticateToken, requireRole(['SUPER_ADMIN', 'PROGRAM_MANAGER', 'AUDITOR']), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { name: true, email: true, role: true } } }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch audit logs' } });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`HPIS Backend running on port ${PORT}`);
  });
}

export { app };
