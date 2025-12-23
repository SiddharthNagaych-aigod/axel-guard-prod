import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  date: Date;
  author: string;
  category: string;
  content: string;
  excerpt: string;
  image: string;
  originalUrl?: string; // Optional legacy URL
  order?: number;
}

const BlogPostSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  image: { type: String, required: true },
  originalUrl: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

// Prevent overwrite
const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
