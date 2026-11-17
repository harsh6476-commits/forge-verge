import app, { ensureDbConnected } from '../server/index.js';

export default async function handler(req: any, res: any) {
  try {
    await ensureDbConnected();
  } catch {
    // Handled by downstream controller fail-closed logic
  }
  return app(req, res);
}
