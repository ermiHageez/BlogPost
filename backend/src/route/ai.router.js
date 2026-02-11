import { Router } from "express";
import prisma from "../../prisma/client.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * Save AI-generated image URL (from Puter frontend)
 */
router.post("/blog/:id/save-image", auth, async (req, res) => {
  try {
    const blogId = Number(req.params.id);
    const { coverImage } = req.body;

    if (!coverImage) {
      return res.status(400).json({ message: "Cover image URL is required" });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: { coverImage },
    });

    return res.json({
      message: "Cover image saved successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Save cover image error:", error);
    res.status(500).json({ message: "Failed to save cover image" });
  }
});

export default router;
