import Blog from "@/models/blog";
import { mongooseconnect } from "@/lib/mongoose";

export default async function handle(req, res) {
    await mongooseconnect();
    const { method } = req;

    if (method === "POST") {
        const { title, slug, description, blogcategory, tags, status } = req.body;

        // Validate required fields
        if (!title || !slug || !description || !blogcategory || !tags || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        try {
            const blogDoc = await Blog.create({
                title,
                slug,
                description,
                blogcategory,
                tags,
                status,
            });
            res.status(201).json(blogDoc);
        } catch (error) {
            if (error.code === 11000) {
                res.status(400).json({ message: "Duplicate key error", field: error.keyValue });
            } else {
                console.error("Error creating blog:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

    if (method === "GET") {
        try {
            // If id is provided in query params, fetch a single blog
            if (req.query?.id) {
                const blog = await Blog.findById(req.query.id);
                if (!blog) {
                    return res.status(404).json({ message: "Blog not found" });
                }
                res.json(blog);
            } else {
                // Fetch all blogs with pagination and optional sorting
                const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by creation date descending
                res.json(blogs);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (method === "PUT") {
        const { _id, title, slug, description, blogcategory, tags, status } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Missing blog ID" });
        }

        try {
            const updatedBlog = await Blog.updateOne(
                { _id },
                { title, slug, description, blogcategory, tags, status }
            );

            if (updatedBlog.nModified === 0) {
                return res.status(404).json({ message: "Blog not found or no changes made" });
            }

            res.json({ message: "Blog updated successfully" });
        } catch (error) {
            console.error("Error updating blog:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (method === "DELETE") {
        try {
            if (!req.query?.id) {
                return res.status(400).json({ message: "Missing blog ID" });
            }

            const deletedBlog = await Blog.deleteOne({ _id: req.query.id });

            if (deletedBlog.deletedCount === 0) {
                return res.status(404).json({ message: "Blog not found" });
            }

            res.json({ message: "Blog deleted successfully" });
        } catch (error) {
            console.error("Error deleting blog:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
