import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
  imageUrl: string;
  order?: number;
}

const ClientSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Client: Model<IClient> = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;
