import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  val: string;
  href: string;
  order?: number;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  val: { type: String, required: true, unique: true },
  href: { type: String, required: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'parent'
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
