import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  post: mongoose.Types.ObjectId; // Reference to BlogPost
  name: string;
  content: string;
  date: Date;
}

const CommentSchema: Schema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
