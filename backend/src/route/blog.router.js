import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import prisma from "../../prisma/client.js";

const router = Router();

// Protected: Create blog
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body || {};

    if (typeof title !== "string" || typeof content !== "string") {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        tags: Array.isArray(tags) ? tags : [],
        userId: req.user.id
      }
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("Blog creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected: Get all blogs
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        user: { select: { id: true, username: true, name: true } },
        comments: true,
        likes: true,
        ratings: true
      },
      orderBy: { id: "desc" }
    });

    const enriched = blogs.map((blog) => {
      const ratingCount = blog.ratings.length;
      const averageRating =
        ratingCount === 0
          ? 0
          : blog.ratings.reduce((sum, r) => sum + r.value, 0) / ratingCount;

      return { ...blog, ratingCount, averageRating };
    });

    res.json(enriched);
  } catch (err) {
    console.error("Fetch blogs error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected: Get blog by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { comments: true, likes: true, ratings: true }
    });

    if (!blog) return res.status(404).json({ message: "Not found" });

    const ratingCount = blog.ratings.length;
    const averageRating =
      ratingCount === 0
        ? 0
        : blog.ratings.reduce((sum, r) => sum + r.value, 0) / ratingCount;

    res.json({ ...blog, ratingCount, averageRating });
  } catch (err) {
    console.error("Fetch blog error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected: Update blog
router.put("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const data = {};
    if (typeof req.body.title === "string") data.title = req.body.title;
    if (typeof req.body.content === "string") data.content = req.body.content;
    if (Array.isArray(req.body.tags)) data.tags = req.body.tags;

    const updated = await prisma.blog.update({
      where: { id },
      data
    });

    res.json(updated);
  } catch (err) {
    console.error("Update blog error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected: Delete blog
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.blog.delete({ where: { id } });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;