import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
  author: string;
  title: string;
  publicationDate: Date;
  category: string;
  subCategory: string;
  travelTags: string;
  summary: string;
  content: string;
  imageUrls?: string[];
}

const BlogSchema = new Schema<IBlog>({
  author: { type: String, required: true },
  title: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  travelTags: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  imageUrls: [{ type: String }],
});

export default model<IBlog>("Blog", BlogSchema);
