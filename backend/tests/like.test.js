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
    .send({ title: "Like Blog", content: "Content" });

  blogId = blog.body.id;
});

describe("Like", () => {
  it("should like blog", async () => {
    const res = await request(app)
      .post("/likes")
      .set("Authorization", `Bearer ${token}`)
      .send({ blogId });

    expect(res.statusCode).toBe(200);
    console.log(res.body);
  });
});
