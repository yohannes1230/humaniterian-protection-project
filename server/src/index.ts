import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Middleware to verify Supabase JWT
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const user = jwt.verify(token, process.env.SUPABASE_SECRET_KEY as string);
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/cases', authenticateToken, async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      include: { person: true }
    });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

app.post('/api/cases', authenticateToken, async (req, res) => {
  try {
    const newCase = await prisma.case.create({
      data: req.body
    });
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create case' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HPIS Backend running on port ${PORT}`);
});
