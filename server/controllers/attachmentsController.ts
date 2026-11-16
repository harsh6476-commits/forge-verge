import { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import DailyPlan from '../models/DailyPlan.js';

// Memory storage for multer so we can inspect and stream to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

export const uploadMiddleware = upload.single('file');

export async function uploadAttachment(req: Request, res: Response): Promise<void> {
  const { date, itemId } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  try {
    const plan = await DailyPlan.findOne({ date });
    if (!plan) {
      res.status(404).json({ error: 'Daily plan not found' });
      return;
    }

    const item = plan.assignedItems.find((i: any) => i.itemId === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in plan' });
      return;
    }

    const isPdf = file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';

    // Stream buffer directly to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'forge_os_attachments',
          resource_type: resourceType,
          format: isPdf ? 'pdf' : undefined,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const newAttachment = {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      originalName: file.originalname,
      format: uploadResult.format || (isPdf ? 'pdf' : 'png'),
      sizeBytes: uploadResult.bytes || file.size,
      uploadedAt: new Date(),
    };

    item.attachments.push(newAttachment);
    await plan.save();

    res.json({ success: true, attachment: newAttachment });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error uploading to Cloudinary' });
  }
}

export async function deleteAttachment(req: Request, res: Response): Promise<void> {
  const { id } = req.params; // publicId
  const { date, itemId } = req.query;

  try {
    if (date && itemId) {
      const plan = await DailyPlan.findOne({ date: String(date) });
      if (plan) {
        const item = plan.assignedItems.find((i: any) => i.itemId === String(itemId));
        if (item) {
          item.attachments = item.attachments.filter((a: any) => a.publicId !== id);
          await plan.save();
        }
      }
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(String(id)).catch(() => {});

    res.json({ success: true, message: 'Attachment deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error deleting attachment' });
  }
}

