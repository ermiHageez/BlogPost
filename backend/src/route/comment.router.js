import { Router } from "express";
import prisma from "../../prisma/client.js";
import { auth } from "../../middleware/auth.middleware.js";
import { io } from "../server.js";

const router = Router();

// Create a new comment
router.post("/", auth, async (req, res) => {
  try {
    const { content, blogId } = req.body;

    // Input validation
    if (!content || !blogId) {
      return res.status(400).json({ message: "Content and blogId are required" });
    }

    // Check if the blog exists
    const blogExists = await prisma.blog.findUnique({ where: { id: Number(blogId) } });
    if (!blogExists) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        blogId: Number(blogId),
        userId: req.user.id,
      },
    });

    // Emit event for new comment
    io.emit("new-comment", {
      blogId: comment.blogId,
      comment: comment.content,
    });

    res.status(201).json(comment); // Use 201 for resource creation
  } catch (err) {
    console.error("Comment creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a comment
router.put("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;

    // Validate input
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Comment not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json(comment);
  } catch (err) {
    console.error("Update comment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a comment
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Comment not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.comment.delete({ where: { id } });
    res.status(204).json({ message: "Comment deleted" }); // Use 204 for successful deletion
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;