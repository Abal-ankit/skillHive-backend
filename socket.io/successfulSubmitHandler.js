const {match_details, games} = require("../config/store");

const handleSuccessfulSubmit = (io, socket, questionIndex, challenges) => {
  const gameId = games.get(socket.user.userId);
  const score = match_details.get(gameId);
  const userId = socket.user.userId;

  const nextIndex = questionIndex + 1;

  const newScore = {
    ...score,
    [userId]: score[userId] + 1,
    questionIndex: nextIndex,
  };

  match_details.set(gameId, newScore);

  // End of challenges
  if (nextIndex >= challenges.length) {
    games.delete(socket.user.userId);

    io.to(gameId).emit("challenge_over", {
      score: newScore,
    });

    io.socketsLeave(gameId); // destroy room
    return;
  }

  // send next challenge
  const nextChallenge = challenges[nextIndex];

  io.to(gameId).emit("next_challenge", {
    nextChallenge,
    currentIndex: nextIndex,
    score: newScore,
  });
};

module.exports = handleSuccessfulSubmit;
