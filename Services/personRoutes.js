// Services/personRoutes.js
const express = require("express");
const router = express.Router();
const PersonsRooms = require('./schema');

// Endpoint to add a person
router.post("/addPerson", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if name and password are provided
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if name already exists in the database
    const existingPerson = await PersonsRooms.Persons.findOne({ name });
    if (existingPerson) {
      return res.status(400).json({ error: "Name already exists" });
    }

    // Create new person with provided name, password, and currRoom set to null
    const newPerson = new PersonsRooms.Persons({ name, password, currRoom: null });
    await newPerson.save();
    
    res.status(201).json({ message: "Person added successfully", person: newPerson });
  } catch (error) {
    console.error("Error adding person:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updateCurrRoom/:personName", async (req, res) => {
  try {
    const personName = req.params.personName;
    const { currRoom } = req.body;

    // Check if currRoom is provided
    if (!currRoom) {
      return res.status(400).json({ error: "currRoom is required" });
    }

    // Find the person by name and update the currRoom field
    const updatedPerson = await PersonsRooms.Persons.findOneAndUpdate({ name: personName }, { currRoom }, { new: true });

    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.status(200).json({ message: "currRoom updated successfully", person: updatedPerson });
  } catch (error) {
    console.error("Error updating currRoom:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/persons", async (req, res) => {
  try {
    // Fetch all persons from the database
    const allPersons = await PersonsRooms.Persons.find();

    // If no persons are found, return a 404 error
    if (!allPersons) {
      return res.status(404).json({ error: "No persons found" });
    }

    // If persons are found, return them as a response
    res.status(200).json({ persons: allPersons });
  } catch (error) {
    console.error("Error fetching persons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
