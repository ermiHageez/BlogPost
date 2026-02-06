import request from "supertest";
import app from "../src/app.js";

let token;
let blogId;

beforeAll(async () => {
  const res = await request(app).post("/auth/login").send({
    email: "test@test.com",
    password: "ermi123"
  });
  token = res.body.accessToken;
});

describe("Blog", () => {
  it("should create blog", async () => {
    const res = await request(app)
      .post("/blog")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog",
        content: "Test Content"
      });

    blogId = res.body.id;
    expect(res.statusCode).toBe(200);
  });

  it("should get blog", async () => {
    const res = await request(app).get(`/blog/${blogId}`);
    expect(res.statusCode).toBe(200);
  });
});
