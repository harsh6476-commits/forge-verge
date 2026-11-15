import { Request, Response } from 'express';
import Notification from '../models/Notification.js';

export async function getNotifications(_req: Request, res: Response): Promise<void> {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(30);
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching notifications' });
  }
}

export async function markNotificationAsRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const notif = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json(notif);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating notification' });
  }
}

