import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubcategory extends Document {
  parent: mongoose.Types.ObjectId; // Reference to Category
  name: string;
  val: string;
  href: string;
  order?: number;
}

const SubcategorySchema: Schema = new Schema({
  parent: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  val: { type: String, required: true }, // unique not strictly required globally, but maybe per category? Let's just keep it flexible or unique global if slugs are unique.
  href: { type: String, required: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true
});

// Compound index to ensure unique slugs? Or just unique val? 
// Current JSON has "val": "indoor" under Camera. 
// If another category has "indoor", is that allowed? 
// Usually slugs should be unique globally for simpler routing. 
// Let's enforce unique 'val' for now based on existing data.
SubcategorySchema.index({ val: 1 }, { unique: true });

const Subcategory: Model<ISubcategory> = mongoose.models.Subcategory || mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);

export default Subcategory;
