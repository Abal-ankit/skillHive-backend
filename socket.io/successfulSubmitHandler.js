const {match_details} = require("../config/store.js");

const handleSuccessfulSubmit = (io, socket, questionIndex, roomIdentity, challenges) => {
    const score = match_details.get(roomIdentity);

    const newScore = {...score, [socket.id] : score[socket.id] + 1};

    if (questionIndex >= challenges.length - 1) {
      // End of challenges
      io.to(roomIdentity).emit("challenge_over", {
        "message": "You have run out of challenges",
        "score" : newScore
      });

      return;
    }

    // Send next challenge
    const nextIndex = questionIndex + 1;
    const nextChallenge = challenges[nextIndex];


    match_details.set(roomIdentity, newScore);

    io.to(roomIdentity).emit("next_challenge", {
      nextChallenge,
      "currentIndex" : nextIndex,
      "score" : newScore
    });
}

module.exports = handleSuccessfulSubmit;
