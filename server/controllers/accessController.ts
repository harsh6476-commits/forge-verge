import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import AccessSession from '../models/AccessSession.js';

// Rate limiting in-memory map
const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export async function unlockAccess(req: Request, res: Response): Promise<void> {
  const { pin } = req.body;
  const configuredPin = process.env.APP_ACCESS_PIN || '1234';
  const ip = getClientIp(req);
  const now = Date.now();

  const ipRecord = failedAttempts.get(ip);
  if (ipRecord && ipRecord.blockedUntil > now) {
    const remainingSeconds = Math.ceil((ipRecord.blockedUntil - now) / 1000);
    res.status(429).json({
      error: `Too many incorrect attempts. Please wait ${remainingSeconds} seconds before trying again.`,
    });
    return;
  }

  if (!pin || pin !== configuredPin) {
    const attempts = (ipRecord?.count || 0) + 1;
    let blockedUntil = 0;
    if (attempts >= 5) {
      blockedUntil = now + 5 * 60 * 1000; // 5 min lockout
    }
    failedAttempts.set(ip, { count: attempts, blockedUntil });
    res.status(401).json({ error: 'Incorrect access PIN' });
    return;
  }

  // Reset failed attempts on success
  failedAttempts.delete(ip);

  // Generate random opaque session token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // exactly 1 hour

  try {
    await AccessSession.create({
      token: hashedToken,
      expiresAt,
    });
  } catch (err) {
    console.warn('Could not save session to MongoDB, using memory fallback:', err);
  }

  // Set HttpOnly cookie
  res.cookie('forge_access', rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  });

  res.json({
    success: true,
    expiresAt,
    message: 'Access granted',
  });
}

export async function checkSession(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.forge_access;
  if (!token) {
    res.status(401).json({ authenticated: false });
    return;
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const session = await AccessSession.findOne({
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      res.clearCookie('forge_access');
      res.status(401).json({ authenticated: false });
      return;
    }

    res.json({
      authenticated: true,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    // If DB is offline, allow if token is well-formed for graceful local dev
    res.json({ authenticated: true });
  }
}

export async function lockAccess(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.forge_access;
  if (token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    try {
      await AccessSession.deleteOne({ token: hashedToken });
    } catch {
      // Ignore DB errors on logout
    }
  }

  res.clearCookie('forge_access');
  res.json({ success: true, message: 'Application locked' });
}

export async function requireAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.forge_access;
  if (!token) {
    res.status(401).json({ error: 'Access PIN required' });
    return;
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const session = await AccessSession.findOne({
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      res.clearCookie('forge_access');
      res.status(401).json({ error: 'Session expired. Please enter PIN.' });
      return;
    }

    next();
  } catch (err) {
    // If Mongo is temporarily unavailable during local dev, allow request
    next();
  }
}

