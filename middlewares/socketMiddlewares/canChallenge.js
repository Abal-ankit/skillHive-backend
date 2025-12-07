const {users} = require("../../config/store");

const canChallenge = (io, socket, opponentId, handleCreateRoom) => {
    if(!users.has(opponentId)) {
        socket.emit("createRoomFailed", {
            "message" : "User is not connected to the server"
        });
        return;
    }

    const opponentSocketId = users.get(opponentId).socketId;
    const opponentSocket = io.sockets.sockets.get(opponentSocketId);

    if (opponentSocket && opponentSocket.rooms.size > 1) {
      socket.emit("createRoomFailed", {
        message: "User is playing another game",
      });
      return;
    }

    handleCreateRoom(io, socket, opponentId);
}

module.exports = canChallenge;
