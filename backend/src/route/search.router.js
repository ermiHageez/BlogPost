import express from "express";
import prisma from "../../prisma/client.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  const q = req.query.q || "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } }
      ]
    },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true
    }
  });

  res.json(users);
});

router.get("/blogs", async (req, res) => {
  const q = req.query.q || "";

  const blogs = await prisma.blog.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { tags: { has: q } }
      ]
    },
    include: {
      user: {
        select: { username: true }
      }
    }
  });

  res.json(blogs);
});

export default router;
