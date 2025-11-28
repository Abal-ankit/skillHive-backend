const {match_details} = require("../config/store.js");

const handleSuccessfulSubmit = (io, socket, questionIndex, roomIdentity, challenges) => {
    const score = match_details.get(roomIdentity);
    const userId = io.sockets.sockets.get(socket.id).user.userId;

    const nextIndex = questionIndex + 1;
    const newScore = {...score, [userId] : score[userId] + 1, "questionIndex" : nextIndex};

    // newScore.set("questionIndex", nextIndex);
    match_details.set(roomIdentity, newScore);

    if (questionIndex > challenges.length - 1) {
      // End of challenges
      io.to(roomIdentity).emit("challenge_over", {
        "message": "You have run out of challenges",
        "score" : newScore
      });

      return;
    }

    // Send next challenge
    const nextChallenge = challenges[nextIndex];

    io.to(roomIdentity).emit("next_challenge", {
      nextChallenge,
      "currentIndex" : nextIndex,
      "score" : newScore
    });
}

module.exports = handleSuccessfulSubmit;
