import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { encryptField, decryptField } from './encryption';

dotenv.config();

// ----------------------------------------------------------------------
// Startup Security Check (Fail Closed)
// ----------------------------------------------------------------------
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
if (!SUPABASE_JWT_SECRET && process.env.NODE_ENV !== 'test') {
  throw new Error('SUPABASE_JWT_SECRET must be set — refusing to start with an insecure default.');
}

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------
// Rate Limiting (Threat Model Mitigation)
// ----------------------------------------------------------------------
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests, please slow down.' } }
});

export const mutationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many write operations, please try again shortly.' } }
});

app.use('/api/', apiLimiter);

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
    const jwtSecret = process.env.SUPABASE_JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-secret-key-do-not-use-in-prod' : '');
    if (!jwtSecret) {
      return res.status(500).json({ success: false, error: { code: 'CONFIG_ERROR', message: 'JWT Secret not configured' } });
    }

    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
    
    const userId = decoded.sub || (decoded as any).id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token payload' } });
    }

    // Authoritative role lookup strictly from database profiles table (defense-in-depth)
    const profile = await prisma.$queryRaw<[{ role: string }]>`SELECT role FROM profiles WHERE id = ${userId}::uuid`;
    
    if (!profile || profile.length === 0) {
      // Reject request: no profile provisioned in database. Never trust client-supplied role claims.
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No profile provisioned in database for this identity' }
      });
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

const createConsentSchema = z.object({
  purpose: z.string().min(1),
  scope: z.string().min(1)
});

const createCaseNoteSchema = z.object({
  content: z.string().min(1)
});

// ----------------------------------------------------------------------
// Public / Health Endpoints
// ----------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ----------------------------------------------------------------------
// Cases Endpoints (RBAC Enforced + Field-Level Decryption)
// ----------------------------------------------------------------------
app.get('/api/cases', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const query: any = {
      include: {
        person: {
          include: { consents: true }
        },
        notes: { orderBy: { createdAt: 'desc' } }
      }
    };

    // Scoped queries based on RBAC matrix:
    // CASE_WORKER and FIELD_OFFICER only see cases assigned to them
    if (user.role === 'CASE_WORKER' || user.role === 'FIELD_OFFICER') {
      query.where = { assignedToId: user.id };
    }

    const cases = await prisma.case.findMany(query);
    
    // Decrypt field-level encrypted fields on read
    const decryptedCases = cases.map((c) => ({
      ...c,
      summary: decryptField(c.summary) || c.summary,
      person: c.person ? {
        ...c.person,
        restrictedName: decryptField(c.person.restrictedName) || c.person.restrictedName
      } : c.person
    }));

    // Audit Log entry
    await prisma.auditLog.create({
      data: {
        action: 'VIEW',
        resource: 'Case:list',
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.json(decryptedCases);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch cases' } });
  }
});

app.post('/api/cases', mutationLimiter, authenticateToken, requireRole(['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER', 'FIELD_OFFICER']), async (req, res) => {
  try {
    const validatedData = createCaseSchema.parse(req.body);
    const user = (req as any).user;
    
    // Encrypt sensitive case summary using AES-256-GCM before database write
    const encryptedSummary = encryptField(validatedData.summary) || validatedData.summary;

    const newCase = await prisma.case.create({
      data: {
        ...validatedData,
        summary: encryptedSummary,
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

    res.status(201).json({
      ...newCase,
      summary: validatedData.summary // Return plaintext to client
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create case' } });
  }
});

app.patch('/api/cases/:id/status', mutationLimiter, authenticateToken, requireRole(['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER']), async (req, res) => {
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

    res.json({
      ...updatedCase,
      summary: decryptField(updatedCase.summary) || updatedCase.summary
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update case status' } });
  }
});

// Delete/Archive case: SUPER_ADMIN only
app.delete('/api/cases/:id', mutationLimiter, authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
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

// ----------------------------------------------------------------------
// Case Notes Endpoints
// ----------------------------------------------------------------------
app.post('/api/cases/:id/notes', mutationLimiter, authenticateToken, requireRole(['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER']), async (req, res) => {
  try {
    const { content } = createCaseNoteSchema.parse(req.body);
    const user = (req as any).user;
    const existingCase = await prisma.case.findUnique({ where: { id: req.params.id } });

    if (!existingCase) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case not found' } });
    }

    if (user.role === 'CASE_WORKER' && existingCase.assignedToId !== user.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot add note to unassigned case' } });
    }

    const note = await prisma.caseNote.create({
      data: {
        content,
        caseId: req.params.id
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'ADD_NOTE',
        resource: `CaseNote:${note.id}`,
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.status(201).json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create note' } });
  }
});

// ----------------------------------------------------------------------
// Consent Management Endpoints (Privacy-by-Design)
// ----------------------------------------------------------------------
app.get('/api/cases/:id/consents', authenticateToken, async (req, res) => {
  try {
    const existingCase = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: { person: { include: { consents: true } } }
    });

    if (!existingCase) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case not found' } });
    }

    const user = (req as any).user;
    if ((user.role === 'CASE_WORKER' || user.role === 'FIELD_OFFICER') && existingCase.assignedToId !== user.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });
    }

    res.json(existingCase.person.consents);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch consents' } });
  }
});

app.post('/api/cases/:id/consents', mutationLimiter, authenticateToken, requireRole(['SUPER_ADMIN', 'PROTECTION_OFFICER', 'CASE_WORKER']), async (req, res) => {
  try {
    const { purpose, scope } = createConsentSchema.parse(req.body);
    const user = (req as any).user;
    const existingCase = await prisma.case.findUnique({ where: { id: req.params.id } });

    if (!existingCase) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Case not found' } });
    }

    if (user.role === 'CASE_WORKER' && existingCase.assignedToId !== user.id) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot record consent on unassigned case' } });
    }

    const consent = await prisma.consent.create({
      data: {
        personId: existingCase.personId,
        purpose,
        scope,
        grantedByUserId: user.id
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'GRANT_CONSENT',
        resource: `Consent:${consent.id}`,
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.status(201).json(consent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to record consent' } });
  }
});

app.patch('/api/consents/:id/revoke', mutationLimiter, authenticateToken, requireRole(['SUPER_ADMIN', 'PROTECTION_OFFICER']), async (req, res) => {
  try {
    const user = (req as any).user;
    const updatedConsent = await prisma.consent.update({
      where: { id: req.params.id },
      data: { revokedAt: new Date() }
    });

    await prisma.auditLog.create({
      data: {
        action: 'REVOKE_CONSENT',
        resource: `Consent:${updatedConsent.id}`,
        result: 'SUCCESS',
        userId: user.id
      }
    });

    res.json(updatedConsent);
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to revoke consent' } });
  }
});

// ----------------------------------------------------------------------
// Export HXL
// ----------------------------------------------------------------------
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
    const query: any = { include: { person: true, case: true } };

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
