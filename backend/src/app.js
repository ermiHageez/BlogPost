import express from "express";
import dotenv from "dotenv";

import authRouter from "./route/auth.router.js";
import blogRouter from "./route/blog.router.js";
import commentRouter from "./route/comment.router.js";
import likeRouter from "./route/like.router.js";
import ratingRouter from "./route/rating.routes.js";
import searchRouter from "./route/search.router.js";
import userRouter from "./route/user.routes.js";
import aiRouter from "./route/ai.router.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/blogs", blogRouter);
app.use("/blog", blogRouter);
app.use("/", aiRouter);
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);
app.use("/ratings", ratingRouter);
app.use("/search", searchRouter);
app.use("/", userRouter);

export default app;
