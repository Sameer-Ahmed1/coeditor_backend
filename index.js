const app = require("./app.js");
const config = require("./utils/config.js");
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const Room = require("./models/room.js");
const User = require("./models/user.js");
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("create", async (roomId, userId) => {
    try {
      socket.join(roomId);
      const room = new Room({ roomId, users: [userId] });
      await room.save();
      const user = await User.findById(userId);
      user.rooms = room._id; // Refer to the room by its ID
      await user.save();
      console.log(`Room ${roomId} created by user ${userId}`);
    } catch (error) {
      console.log(error);
      socket.emit("error", error.message);
    }
  });

  socket.on("join", async (roomId, userId) => {
    try {
      socket.join(roomId);
      const room = await Room.findOne({ roomId });
      room.users.push(userId);
      await room.save();
      const user = await User.findById(userId);
      user.rooms = room._id; // Refer to the room by its ID
      await user.save();
      console.log(`User ${userId} joined room ${roomId}`);
    } catch (error) {
      console.log(error);
      socket.emit("error", error.message);
    }
  });

  socket.on("message", async (roomId, userId, message, username) => {
    try {
      const room = await Room.findOne({ roomId });
      room.messages.push({ user: userId, message, timestamp: new Date() });
      await room.save();
      io.to(roomId).emit("message", {
        user: userId,
        message,
        timestamp: new Date(),
        username: username,
      });
      console.log(`User ${userId} sent message to room ${roomId}`);
    } catch (error) {
      console.log(error);
      socket.emit("error", error.message);
    }
  });

  socket.on("leave", async (roomId, userId) => {
    try {
      socket.leave(roomId);
      const room = await Room.findOne({ roomId });
      room.users = room.users.filter((user) => user._id.toString() !== userId);
      await room.save();
      const user = await User.findById(userId);
      user.rooms = null; // Remove the reference to the room
      await user.save();
      console.log(`User ${userId} left room ${roomId}`);
    } catch (error) {
      console.log(error);
      socket.emit("error", error.message);
    }
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
