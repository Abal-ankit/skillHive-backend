const handleLeaveRoom = (socket, roomIdentity) => {
    socket.leave(roomIdentity);
    socket.to(roomIdentity).emit(`A user has left the room ${room}`);
}

module.exports = handleLeaveRoom;
