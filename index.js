const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');

const socketHandler = require('./Services/socketHandler');
const personRoutes = require('./Services/personRoutes');
const roomRoutes = require('./Services/roomRoutes');
const authenticationRoutes = require('./Services/authenticationRoutes');
const fileRoutes = require('./Services/fileRoutes');
const PersonsRooms = require('./Services/schema');

mongoose.connect('mongodb+srv://shivarama635:gxkgy87EXKwkhjjn@cluster0.gqpduvy.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io, PersonsRooms);

// Use person routes
app.use(personRoutes);

// Use room routes
app.use(roomRoutes);
app.use(authenticationRoutes);
app.use(fileRoutes);

const port = 4001;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
