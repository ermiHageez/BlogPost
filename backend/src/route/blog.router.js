import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import prisma from "../../prisma/client.js";

const router = Router();

router.post("/", auth, async (req, res) => {
  const tags = Array.isArray(req.body.tags) ? req.body.tags : [];
  const blog = await prisma.blog.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      tags,
      userId: req.user.id
    }
  });
  res.status(200).json(blog);
});

router.get("/", async (req, res) => {
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
});

router.get("/:id", async (req, res) => {
  const blog = await prisma.blog.findUnique({
    where: { id: Number(req.params.id) },
    include: { comments: true, likes: true, ratings: true }
  });

  if (!blog) return res.status(404).json({ message: "Not found" });

  const ratingCount = blog.ratings.length;
  const averageRating =
    ratingCount === 0
      ? 0
      : blog.ratings.reduce((sum, r) => sum + r.value, 0) / ratingCount;

  res.json({ ...blog, ratingCount, averageRating });
});

router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
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
});

router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.blog.findUnique({ where: { id } });

  if (!existing) return res.status(404).json({ message: "Not found" });
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.blog.delete({ where: { id } });
  res.json({ message: "Blog deleted" });
});

export default router;
