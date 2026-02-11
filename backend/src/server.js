// src/server.js
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";

const server = http.createServer(app);

export const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// only run when not in test mode
if (process.env.NODE_ENV !== "test") {
  server.listen(8080, () => {
    console.log("Server running on port 8080");
  });
}

export default server;