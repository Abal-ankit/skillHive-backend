const handleFindMatch = (io, socket, waitingRooms) => {
    if (waitingRooms.length > 0) {
      console.log("player removed");
      const room = waitingRooms.shift();
      socket.join(room);
      console.log("Room id : " + room);
      io.to(room).emit("match_found", {
        roomId: room,
      });
    } else {
      console.log("player added");
      const room = new Date().toISOString();
      socket.join(room);
      waitingRooms.push(room);
      
      io.to(room).emit("get_room", {
        info: "You have joined the match room! Waiting for opponents",
      });
    }
}

module.exports = handleFindMatch;
