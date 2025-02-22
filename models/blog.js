import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  blogcategory: { type: [String], required: true }, // Allow array of strings for multiple categories
  tags: { type: [String], required: true },
  status: { type: String, required: true },
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
