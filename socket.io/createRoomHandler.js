const isValidUser = require("../middlewares/isValidUser.js");
const {users} = require("../config/store.js");

const handleCreateRoom = (io, socket, roomIdentity, opponentId) => {
  console.log(roomIdentity, opponentId);
  const result = isValidUser(opponentId);
  if (!result) {
    io.to(socket.id).emit("createRoomFailed", {
      message: "opponent is invalid",
    });
  }

  let opponentSocketId = users.get(opponentId);
  

  if (!opponentSocketId) {
    io.to(socket.id).emit("createRoomFailed", {
      message: "opponent is not on game server",
    });
  }

  console.log(opponentSocketId);

  socket.join(roomIdentity);
  io.to(roomIdentity).emit("roomCreated", {
    message: `You have created room ${roomIdentity}`,
  });
  
  io.to(opponentSocketId.socketId).emit("incomingChallenge", {
    roomIdentity: roomIdentity,
  });
};

module.exports = handleCreateRoom;
