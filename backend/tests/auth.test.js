import request from "supertest";
import app from "../src/app.js";

describe("Auth", () => {
    //register test should be before login test, otherwise it will fail because the user is not created yet
  it("should register user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(201);
  });
  //login test should be after register test, otherwise it will fail because the user is not created yet
  it("should login user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });
    expect(res.body.accessToken).toBeDefined();
  });

});
