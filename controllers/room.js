const express = require("express");
const roomRouter = express.Router();
const Room = require("../models/room");

roomRouter.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    console.log("room fetched ", room);
    if (room) {
      res.json(room);
    } else {
      res.status(404).send({ error: "Room not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});
roomRouter.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = roomRouter;
