import mongoose, { Document, Schema } from 'mongoose';

export interface IAccessSession extends Document {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const AccessSessionSchema = new Schema<IAccessSession>({
  token: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: '1h' } },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AccessSession || mongoose.model<IAccessSession>('AccessSession', AccessSessionSchema);

