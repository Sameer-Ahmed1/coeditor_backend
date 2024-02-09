// Services/roomRoutes.js
const express = require("express");
const router = express.Router();
const PersonsRooms = require('./schema');

// Endpoint to get all files of a room
router.get("/getRoomFiles/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
  
      // Check if roomId is valid
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
  
      // Find the room in the database
      const room = await PersonsRooms.RoomsfindById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      // Send the files of the room
      res.status(200).json({ files: room.files });
    } catch (error) {
      console.error("Error getting room files:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Endpoint to edit room files
  router.put("/editRoomFiles/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
      const { files } = req.body;
  
      // Check if roomId is valid
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
  
      // Find the room in the database
      const room = await PersonsRooms.RoomsfindById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      // Update the files of the room
      room.files = files;
      await room.save();
  
      // Send the updated room
      res.status(200).json({ message: "Room files updated successfully", room });
    } catch (error) {
      console.error("Error editing room files:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Endpoint to add a single file to a room
  router.post("/addRoomFile/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
      const { fileName, fileContent } = req.body;
  
      // Check if roomId is valid
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
  
      // Find the room in the database
      const room = await PersonsRooms.RoomsfindById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      // Add the file to the room
      room.files.push({ name: fileName, content: fileContent });
      await room.save();
  
      // Send the updated room
      res.status(200).json({ message: "File added to room successfully", room });
    } catch (error) {
      console.error("Error adding room file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  // Endpoint to delete a single file from a room
  router.delete("/deleteRoomFile/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
      const { fileName } = req.body;
  
      // Check if roomId is valid
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
  
      // Find the room in the database
      const room = await PersonsRooms.RoomsfindById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      // Check if the file exists in the room
      const fileIndex = room.files.findIndex(file => file.name === fileName);
      if (fileIndex === -1) {
        return res.status(404).json({ error: "File not found in the room" });
      }
  
      // Remove the file from the room
      room.files.splice(fileIndex, 1);
      await room.save();
  
      // Send the updated room
      res.status(200).json({ message: "File deleted from room successfully", room });
    } catch (error) {
      console.error("Error deleting room file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Endpoint to edit a single file in a room
  router.put("/editRoomFile/:roomId/:fileName", async (req, res) => {
    try {
      const { roomId, fileName } = req.params;
      const { fileContent } = req.body;
  
      // Check if roomId is valid
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
  
      // Find the room in the database
      const room = await PersonsRooms.RoomsfindById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      // Check if the file exists in the room
      const fileToUpdate = room.files.find(file => file.name === fileName);
      if (!fileToUpdate) {
        return res.status(404).json({ error: "File not found in the room" });
      }
  
      // Update the content of the file
      fileToUpdate.content = fileContent;
      await room.save();
  
      // Send the updated room
      res.status(200).json({ message: "File updated in room successfully", room });
    } catch (error) {
      console.error("Error editing room file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  module.exports = router;  