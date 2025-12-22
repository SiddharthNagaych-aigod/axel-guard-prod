import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  product_code: string;
  name: string; // product_name
  product_type: string; // Legacy field, might be useful to keep for reference?
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  images: string[];
  features: string[];
  technical_features: string[];
  price?: string;
  pdf_manual?: string;
  order?: number;
}

const ProductSchema: Schema = new Schema({
  product_code: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Mapped from product_name
  product_type: { type: String }, // Keeping as legacy for now
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  images: [{ type: String }],
  features: [{ type: String }],
  technical_features: [{ type: String }],
  price: { type: String },
  pdf_manual: { type: String },
  order: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
