const express = require("express");
const router = express.Router();
const PersonsRooms = require('./schema');

// Endpoint to authenticate user login
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if name and password are provided
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    // Check if the user exists in the database
    const user = await PersonsRooms.Persons.findOne({ name });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // If both name and password match, authentication successful
    return res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to check if room join is valid
router.post("/checkRoomJoin", async (req, res) => {
  try {
      const { roomId, joinLink } = req.body;

      // Check if roomId and joinLink are provided
      if (!roomId || !joinLink) {
          return res.status(400).json({ error: "Room ID and join link are required" });
      }

      // Fetch all rooms data
      const allRooms = await PersonsRooms.Rooms.find();

      // Check if roomId is valid
      const matchingRoom = allRooms.find(room => room.roomid === roomId);

      // Check if the room exists in the database
      if (!matchingRoom) {
          return res.status(404).json({ error: "Room not found" });
      }

      // Check if the join link matches
      if (matchingRoom.joinLink !== joinLink) {
          return res.status(401).json({ error: "Invalid join link" });
      }

      // If both roomId and joinLink are valid, room join is valid
      return res.status(200).json({ message: "Room join is valid"});
  } catch (error) {
      console.error("Error checking room join:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
