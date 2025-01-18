import Blog from "@/models/blog";
import {
    mongooseconnect
} from "@/lib/mongoose";

export default async function handle(req, res) {
    // if authentication connect to Mongodb
    await mongooseconnect();
    const {
        method
    } = req;
    // data send or post data
    if (method === "POST") {
    const { title, slug, description, blogcategory, tags, status } = req.body;

    // Basic validation
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
            // Handle duplicate key errors
            res.status(400).json({ message: "Duplicate key error", field: error.keyValue });
        } else {
            console.error("Error creating blog:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

    // data fetch or get
    if (method === "GET") {
        if (req.query?.id) {
            req.json(await Blog.findId(req.query.id));
        } else {
            req.json((await Blog.find()).reverse());
        }
    }
    // update
    if (method === "PUT") {
        const {
            _id,
            title,
            slug,
            description,
            blogcategory,
            tags,
            status
        } = req.body;
        await Blog.updateOne({
            _id
        }, {
            title,
            slug,
            description,
            blogcategory,
            tags,
            status,
        });
        res.json(true);
    }

    // delete one blog
    if (method === "DELETE") {
        if (req.query?.id) {
            await Blog.deleteOne({ _id: req.query.id });
            res.json(true);

            
        }
    }
}