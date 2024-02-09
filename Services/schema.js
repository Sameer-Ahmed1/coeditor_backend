// Services/schema.js
const mongoose = require('mongoose');

const personsSchema = new mongoose.Schema({
  name: String,
  password: String,
  currRoom : String,
});

const roomsSchema = new mongoose.Schema({
  roomname: String,
  roomid: String,
  joinLink: String,
  owner: String,
  files: [{ name: String, content: String }], // Array of objects with name and content fields
  chats: [String],
  persons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Persons' }] // Reference to Persons schema
});

const Persons = mongoose.model('Persons', personsSchema);
const Rooms = mongoose.model('Rooms', roomsSchema);

module.exports = { Persons, Rooms };
