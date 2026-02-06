import express from "express";
import prisma from "../../prisma/client.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Create or update a rating (upsert)
router.post("/", auth, async (req, res) => {
  try {
    const { blogId, value } = req.body;

    if (!blogId || typeof value !== "number") {
      return res.status(400).json({ message: "blogId and value are required" });
    }
    if (value < 1 || value > 5) {
      return res.status(400).json({ message: "value must be between 1 and 5" });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_blogId: {
          userId: req.user.id,
          blogId: Number(blogId),
        },
      },
      create: {
        userId: req.user.id,
        blogId: Number(blogId),
        value: Number(value),
      },
      update: {
        value: Number(value),
      },
    });

    res.status(201).json(rating);
  } catch (err) {
    console.error("Rating creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get average rating for a blog
router.get("/blog/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    if (isNaN(blogId)) {
      return res.status(400).json({ message: "Invalid blogId" });
    }

    const avg = await prisma.rating.aggregate({
      where: { blogId },
      _avg: { value: true },
    });
    const count = await prisma.rating.count({ where: { blogId } });

    res.json({ average: avg._avg.value ?? 0, count });
  } catch (err) {
    console.error("Fetch average rating error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a rating
router.put("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { value } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid rating ID" });
    if (typeof value !== "number") {
      return res.status(400).json({ message: "value is required" });
    }
    if (value < 1 || value > 5) {
      return res.status(400).json({ message: "value must be between 1 and 5" });
    }

    const existing = await prisma.rating.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const rating = await prisma.rating.update({
      where: { id },
      data: { value: Number(value) },
    });

    res.json(rating);
  } catch (err) {
    console.error("Update rating error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a rating
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) return res.status(400).json({ message: "Invalid rating ID" });

    const existing = await prisma.rating.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.rating.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error("Delete rating error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;