import Blog from "@/models/blog";
import { mongooseconnect } from "@/lib/mongoose";

export default async function handle(req, res) {
    await mongooseconnect();
    const { method } = req;

    if (method === "POST") {
        const { title, slug, description, blogcategory, tags, status } = req.body;

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
            if (req.query?.id) {
                res.json(await Blog.findById(req.query.id));
            } else {
                res.json((await Blog.find()).reverse());
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (method === "PUT") {
        const { _id, title, slug, description, blogcategory, tags, status } = req.body;
        try {
            await Blog.updateOne(
                { _id },
                { title, slug, description, blogcategory, tags, status }
            );
            res.json(true);
        } catch (error) {
            console.error("Error updating blog:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (method === "DELETE") {
        try {
            if (req.query?.id) {
                await Blog.deleteOne({ _id: req.query.id });
                res.json(true);
            } else {
                res.status(400).json({ message: "Missing ID" });
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
