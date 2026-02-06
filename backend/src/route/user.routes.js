import express from "express";
import prisma from "../../prisma/client.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    where: { username: { contains: req.query.q || "" } }
  });
  res.json(users);
});

router.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      lastName: true,
      bio: true,
      profilePicture: true,
      role: true,
      _count: {
        select: { blogs: true, followers: true, following: true }
      }
    }
  });

  if (!user) return res.status(404).json({ message: "Not found" });
  res.json(user);
});

router.put("/users/me", auth, async (req, res) => {
  const data = {};
  if (typeof req.body.username === "string") data.username = req.body.username;
  if (typeof req.body.email === "string") data.email = req.body.email;
  if (typeof req.body.name === "string") data.name = req.body.name;
  if (typeof req.body.lastName === "string") data.lastName = req.body.lastName;
  if (typeof req.body.bio === "string") data.bio = req.body.bio;
  if (typeof req.body.profilePicture === "string") {
    data.profilePicture = req.body.profilePicture;
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data
  });

  res.json(user);
});

router.post("/users/:id/follow", auth, async (req, res) => {
  const followingId = Number(req.params.id);
  if (followingId === req.user.id) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  const existing = await prisma.follow.findFirst({
    where: { followerId: req.user.id, followingId }
  });

  if (existing) {
    return res.status(200).json({ message: "Already following" });
  }

  const follow = await prisma.follow.create({
    data: { followerId: req.user.id, followingId }
  });

  res.json(follow);
});

router.delete("/users/:id/follow", auth, async (req, res) => {
  const followingId = Number(req.params.id);
  const existing = await prisma.follow.findFirst({
    where: { followerId: req.user.id, followingId }
  });

  if (!existing) {
    return res.status(404).json({ message: "Not following" });
  }

  await prisma.follow.delete({ where: { id: existing.id } });
  res.json({ message: "Unfollowed" });
});

router.delete("/users/:id", async (req, res) => {
  await prisma.user.delete({ where: { id: +req.params.id } });
  
  res.json({ message: "User deleted" });
});

export default router;
