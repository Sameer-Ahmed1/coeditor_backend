// socketHandler.js
const SocketHandler = (io, PersonsRooms) => {
    io.on("connection", (socket) => {
      console.log("New client connected");
  
      // Handle joining and leaving rooms
  
      socket.on("code", ({ roomId, fileName, newCode }) => {
        console.log(`fileName: ${fileName}, newCode: ${newCode}`);
        io.to(roomId).emit("code", { fileName, newCode });
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
  
      // Add MongoDB interaction here
  
      // Example: Saving data to PersonsRooms
      socket.on("addPersonRoom", (data) => {
        const { person, room } = data;
        const newPersonsRooms = new PersonsRooms({ person, room });
        newPersonsRooms.save().then(() => {
          console.log("New data saved to PersonsRooms:", data);
        }).catch((error) => {
          console.error("Error saving data to PersonsRooms:", error);
        });
      });
    });
  };
  
  module.exports = SocketHandler;