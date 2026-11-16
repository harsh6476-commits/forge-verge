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

// Credential-compatible CORS (No wildcard origin)
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'FORGE OS API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log('Connected to MongoDB Atlas successfully');
      await seedInitialCurriculum();
    })
    .catch((err) => {
      console.warn('MongoDB connection failed. Local in-memory seed fallback available:', err.message);
    });
} else {
  console.log('MONGODB_URI not provided. Please configure it in .env');
}

app.listen(PORT, () => {
  console.log(`FORGE OS Backend Server running on port ${PORT}`);
});

export default app;

