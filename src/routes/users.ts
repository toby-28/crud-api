import http from "http";
import { parse } from "url";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import { validateUUID } from "../utils/validateUUID.js";

export const handleRequest = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const { pathname } = parse(req.url || "", true);
  const method = req.method || "";
  const idMatch = pathname?.match(/^\/api\/users\/([a-f0-9\-]+)$/);
  const isUsersEndpoint = pathname === "/api/users";

  res.setHeader("Content-Type", "application/json");

  try {
    if (isUsersEndpoint && method === "GET") {
      res.writeHead(200);
      res.end(JSON.stringify(getAllUsers()));
      return;
    }

    if (idMatch && method === "GET") {
      const id = idMatch[1];
      if (!validateUUID(id))
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Invalid UUID" }));
      const user = getUserById(id);
      if (!user)
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "User not found" }));
      res.writeHead(200).end(JSON.stringify(user));
      return;
    }

    if (isUsersEndpoint && method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const { username, age, hobbies } = JSON.parse(body);
        if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
          return res
            .writeHead(400)
            .end(JSON.stringify({ message: "Missing required fields" }));
        }
        const newUser = createUser({ username, age, hobbies });
        res.writeHead(201).end(JSON.stringify(newUser));
      });
      return;
    }

    if (idMatch && method === "PUT") {
      const id = idMatch[1];
      if (!validateUUID(id))
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Invalid UUID" }));
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const { username, age, hobbies } = JSON.parse(body);
        if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
          return res
            .writeHead(400)
            .end(JSON.stringify({ message: "Missing required fields" }));
        }
        const updated = updateUser(id, { username, age, hobbies });
        if (!updated)
          return res
            .writeHead(404)
            .end(JSON.stringify({ message: "User not found" }));
        res.writeHead(200).end(JSON.stringify(updated));
      });
      return;
    }

    if (idMatch && method === "DELETE") {
      const id = idMatch[1];
      if (!validateUUID(id))
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Invalid UUID" }));
      const deleted = deleteUser(id);
      if (!deleted)
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "User not found" }));
      res.writeHead(204).end();
      return;
    }

    res.writeHead(404).end(JSON.stringify({ message: "Route not found" }));
  } catch (err) {
    res
      .writeHead(500, { "Content-Type": "application/json" })
      .end(JSON.stringify({ message: "Internal Server Error" }));
  }
};
