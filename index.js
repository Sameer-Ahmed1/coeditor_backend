const app = require("./app.js");
const config = require("./utils/config.js");
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`Client joined room ${roomId}`);
  });
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`Client left room ${roomId}`);
  });

  socket.on("code", (roomId, newCode) => {
    socket.to(roomId).emit("code", newCode);
  });
  socket.on("code", ({ roomId, fileName, newCode }) => {
    console.log(`fileName: ${fileName}, newCode: ${newCode}`);
    io.to(roomId).emit("code", { fileName, newCode });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
