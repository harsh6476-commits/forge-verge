import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { seedInitialCurriculum } from './services/curriculumService.js';

dotenv.config();

export function validateEnvironment(): void {
  const missing: string[] = [];
  if (!process.env.MONGODB_URI) {
    missing.push('MONGODB_URI');
  }
  if (!process.env.APP_ACCESS_PIN) {
    missing.push('APP_ACCESS_PIN');
  }
  if (missing.length > 0) {
    const msg = `FATAL: Missing required environment variable(s): ${missing.join(', ')}. Server cannot start securely.`;
    console.error(msg);
    if (process.env.NODE_ENV !== 'test') {
      throw new Error(msg);
    }
  }
}

// Validate environment on startup
try {
  validateEnvironment();
} catch {
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Credential-compatible CORS (Allows local dev, configured origin, and Vercel deployments)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      if (
        origin === CLIENT_ORIGIN ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Database Connection Manager (Supports traditional server & serverless) ───
let dbPromise: Promise<typeof mongoose> | null = null;

export async function ensureDbConnected(): Promise<typeof mongoose | null> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return null;
  }
  if (!dbPromise) {
    dbPromise = mongoose
      .connect(mongoUri)
      .then(async (m) => {
        console.log('Connected to MongoDB Atlas successfully');
        await seedInitialCurriculum();
        return m;
      })
      .catch((err) => {
        dbPromise = null;
        console.warn('MongoDB connection failed:', err.message);
        throw err;
      });
  }
  return dbPromise;
}

// Pre-connect on startup
ensureDbConnected().catch(() => {});

// Middleware ensuring DB connection is ready before route handling (essential for serverless)
app.use(async (_req, _res, next) => {
  try {
    await ensureDbConnected();
  } catch {
    // Handled downstream by controller fail-closed checks (503)
  }
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'FORGE OS API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes (both on /api and root to handle potential proxy rewrites)
app.use('/api', apiRoutes);
app.use(apiRoutes);

// Only bind to local port when not running as a Vercel serverless function
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`FORGE OS Backend Server running on port ${PORT}`);
  });
}

export default app;
