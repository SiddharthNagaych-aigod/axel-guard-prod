import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  title: string;
  icon: string;
  description: string;
  link: string;
  order?: number;
}

const ServiceSchema: Schema = new Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  order: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
