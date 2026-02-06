import request from "supertest";
import app from "../src/app.js";

let token;
let blogId;

beforeAll(async () => {
  const login = await request(app).post("/auth/login").send({
    email: "test@test.com",
    password: "123456"
  });
  token = login.body.accessToken;

  const blog = await request(app)
    .post("/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Blog", content: "Content" });

  blogId = blog.body.id;
});

describe("Comment", () => {
  it("should create comment", async () => {
    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        blogId,
        content: "Nice post"
      });

    expect(res.statusCode).toBe(200);
  });
});
