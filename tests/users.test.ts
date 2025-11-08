import request from "supertest";
import { app } from "../src/app"; // adjust path if needed

describe("CRUD API /api/users", () => {
  let userId: string;

  it("GET /api/users → should return empty array", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /api/users → should create a new user", async () => {
    const newUser = {
      username: "Alice",
      age: 30,
      hobbies: ["reading", "gaming"],
    };

    const res = await request(app).post("/api/users").send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newUser);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  it("GET /api/users/:id → should return created user", async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it("PUT /api/users/:id → should update user", async () => {
    const updatedUser = {
      username: "AliceUpdated",
      age: 31,
      hobbies: ["traveling"],
    };

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ...updatedUser, id: userId });
  });

  it("DELETE /api/users/:id → should delete user", async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.status).toBe(204);
  });

  it("GET /api/users/:id → should return 404 for deleted user", async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(404);
  });
});
