const handleFindMatch = (io, socket, waitingRooms) => {
    if (waitingRooms.length > 0) {
      const room = waitingRooms.shift();
      socket.join(room);

      io.to(room).emit("match_found", {
        roomId: room,
      });
    } else {
      const room = new Date().toISOString();
      socket.join(room);
      waitingRooms.push(room);
      
      io.to(room).emit("get_room", {
        info: "You have joined the match room! Waiting for opponents",
      });
    }
}

module.exports = handleFindMatch;
