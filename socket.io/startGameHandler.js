const { match_details, games } = require("../config/store.js");
const { Game } = require("../models/index.js");

const handleStartGame = async (io, roomIdentity, challenges) => {
  console.log(roomIdentity);

  const usersSet = await io.to(roomIdentity).allSockets(); // ✅ await here

  const userIds = [];

  for (const socketId of usersSet) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.user) {
      userIds.push(socket.user.userId);
      games.set(socket.user.userId, roomIdentity);
    }
  }

  const score = userIds.reduce((acc, userId) => {
    acc[userId] = 0;
    return acc;
  }, {});

  score["questionIndex"] = 0;

  match_details.set(roomIdentity, score);

  for (let userId of userIds) {
    await Game.create({ game_id: roomIdentity, user_id: userId });
  }

  io.to(roomIdentity).emit("game_details", {
    challenge: challenges[0],
    currentIndex: 0,
    score: score,
  });
};

module.exports = handleStartGame;
