// Services/roomRoutes.js
const express = require("express");
const router = express.Router();
const PersonsRooms = require('./schema');

// Function to generate random room ID
const mongoose = require('mongoose');

function generateRandomRoomId() {
  const objectId = new mongoose.Types.ObjectId();
  return objectId.toString();
}

// These end points are available in this
// Endpoint to add a room
// Endpoint to add a chat to a room
// Endpoint to add a person to a room
// Endpoint to remove a person from a room
// Endpoint to get all files of a room
// Endpoint to edit room files
// Endpoint to add a single file to a room
// Endpoint to delete a single file from a room


// Function to generate join link
function generateJoinLink() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let result = 'joinhere@';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Endpoint to add a room
router.post("/addRoom", async (req, res) => {
  try {
    const { roomname, owner } = req.body;
    const roomid = generateRandomRoomId();
    const joinLink = generateJoinLink();

    // Check if owner exists in the database
    const existingOwner = await PersonsRooms.Persons.findOne({ name: owner });

    // If owner doesn't exist, return an error
    if (!existingOwner) {
      return res.status(400).json({ error: "Owner name is incorrect" });
    }

    // Create a new room object
    const newRoom = new PersonsRooms.Rooms({ 
      roomname, 
      roomid, 
      joinLink, 
      owner, 
      files: [],
      chats: ["chat here"], 
      persons: [existingOwner._id] // Add the owner's ID to the persons array
    });
    
    // Save the new room to the database
    await newRoom.save();
    
    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/addChatToRoom/:roomId", async (req, res) => {
  try {
    const { chat } = req.body; // Extract chat from request body
    const roomId = req.params.roomId; // Extract roomId from request params

    // Check if chat is provided
    if (!chat) {
      return res.status(400).json({ error: "chat is required" });
    }

    // Fetch all rooms from the database
    const allRooms = await PersonsRooms.Rooms.find();

    // Find the room with the matching ID
    let roomToUpdate = null;
    for (const room of allRooms) {
      if (room.roomid === roomId) {
        roomToUpdate = room;
        break;
      }
    }

    // If roomToUpdate is null, room with the given ID was not found
    if (!roomToUpdate) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Add the chat to the room
    roomToUpdate.chats.push(chat);
    await roomToUpdate.save();

    res.status(200).json({ message: "Chat added to room successfully", room: roomToUpdate });
  } catch (error) {
    console.error("Error adding chat to room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Endpoint to add a person to a room
router.post("/addPersonToRoom/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { personName } = req.body;

    // Check if personName is provided
    if (!personName) {
      return res.status(400).json({ error: "personName is required" });
    }

    // Check if roomId is valid
    if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid room ID" });
    }

    // Check if the room exists in the database
    const room = await PersonsRooms.Rooms.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the room already has 50 persons
    if (room.persons.length >= 50) {
      return res.status(400).json({ error: "No more persons can be added to this room" });
    }

    // Check if the person exists in the database
    const existingPerson = await PersonsRooms.Persons.findOne({ name: personName });
    if (!existingPerson) {
      return res.status(400).json({ error: "Person does not exist" });
    }

    // Check if the person is already in the room
    if (room.persons.includes(existingPerson._id)) {
      return res.status(400).json({ error: "Person is already in the room" });
    }

    // Add the person to the room
    room.persons.push(existingPerson._id);
    await room.save();

    res.status(200).json({ message: "Person added to room successfully", room });
  } catch (error) {
    console.error("Error adding person to room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to remove a person from a room
router.delete("/removePersonFromRoom/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { personName } = req.body;

    // Check if personName is provided
    if (!personName) {
      return res.status(400).json({ error: "personName is required" });
    }

    // Check if roomId is valid
    if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid room ID" });
    }

    // Check if the room exists in the database
    const room = await PersonsRooms.Rooms.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the person exists in the database
    const existingPerson = await PersonsRooms.Persons.findOne({ name: personName });
    if (!existingPerson) {
      return res.status(400).json({ error: "Person does not exist" });
    }

    // Check if the person is the owner of the room
    if (room.owner !== existingPerson.name) {
      return res.status(403).json({ error: "Only the owner can remove persons from the room" });
    }

    // Remove the person from the room
    const index = room.persons.indexOf(existingPerson._id);
    if (index !== -1) {
      room.persons.splice(index, 1);
      await room.save();
    }

    res.status(200).json({ message: "Person removed from room successfully", room });
  } catch (error) {
    console.error("Error removing person from room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;  