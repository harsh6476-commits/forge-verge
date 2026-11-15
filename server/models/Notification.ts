import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'streak' | 'completion' | 'checkpoint' | 'info';
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['streak', 'completion', 'checkpoint', 'info'], default: 'info' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

