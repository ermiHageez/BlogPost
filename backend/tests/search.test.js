import request from "supertest";
import app from "../src/app.js";

describe("Search", () => {
  it("should search blogs", async () => {
    const res = await request(app).get("/search/blogs?q=test");
    expect(res.statusCode).toBe(200);
  });

  it("should search users", async () => {
    const res = await request(app).get("/search/users?q=test");
    expect(res.statusCode).toBe(200);
  });
});
