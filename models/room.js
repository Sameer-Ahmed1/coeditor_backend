const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: String,
  code: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ], // Array of user IDs
  messages: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      timestamp: Date,
    },
  ],
});
roomSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
