import { Router } from "express";
import prisma from "../../prisma/client.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, async (req, res) => {
  const blogId = Number(req.body.blogId);
  if (!blogId) return res.status(400).json({ message: "blogId is required" });

  const existing = await prisma.like.findFirst({
    where: { blogId, userId: req.user.id }
  });

  if (existing) {
    return res.status(200).json({ message: "Already liked", like: existing });
  }

  const like = await prisma.like.create({
    data: {
      blogId,
      userId: req.user.id
    }
  });
  res.json(like);
});

router.delete("/:blogId", auth, async (req, res) => {
  const blogId = Number(req.params.blogId);
  const existing = await prisma.like.findFirst({
    where: { blogId, userId: req.user.id }
  });

  if (!existing) {
    return res.status(404).json({ message: "Like not found" });
  }

  await prisma.like.delete({ where: { id: existing.id } });
  res.json({ message: "Like removed" });
});

export default router;
