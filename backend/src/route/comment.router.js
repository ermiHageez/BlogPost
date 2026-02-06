import { Router } from "express";
import prisma from "../../prisma/client.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, async (req, res) => {
  const comment = await prisma.comment.create({
    data: {
      content: req.body.content,
      blogId: req.body.blogId,
      userId: req.user.id
    }
  });
  res.json(comment);
});

router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Not found" });
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: { content: req.body.content }
  });
  res.json(comment);
});
router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Not found" });
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.comment.delete({ where: { id } });
  res.json({ message: "Comment deleted" });
});
export default router;
