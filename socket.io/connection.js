const { Challenge } = require("../models");
const {matches, score, users} = require("../config/store.js");

let waitingUsers = [];
let challenges = [];

const connection = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    // console.log(socket.user.userName);
    users.set(socket.id, socket.user.userName);

    // When a user looks for a match
    socket.on("find_match", async () => {
      console.log(waitingUsers.length);
      if (waitingUsers.length > 0) {
        const partnerSocket = waitingUsers.shift();

        // Prevent matching with self if only one is waiting
        if (partnerSocket.id === socket.id && waitingUsers.length === 0) {
          io.to(socket.id).emit("match_found", { partnerId: "Not found" });
          waitingUsers.push(socket);
          return;
        }

        // Store matched pair
        matches.push({ first: partnerSocket.id, second: socket.id });
        // Load challenges from DB once
        challenges = await Challenge.findAll();

        // Send first challenge to both
        io.to(socket.id).emit("match_found", {
          partnerId: partnerSocket.id,
          partnerName : users.get(partnerSocket.id),
          challenges: challenges[0],
          currentIndex: 0,
        });

        io.to(partnerSocket.id).emit("match_found", {
          partnerId: socket.id,
          partnerName : users.get(socket.id),
          challenges: challenges[0],
          currentIndex: 0,
        });
      } else {
        waitingUsers.push(socket);
      }
    });

    // When user successfully submits
    socket.on("successful_submit", ({ questionIndex, opponentId }) => {
      if (questionIndex >= challenges.length - 1) {
        // End of challenges
        io.to(socket.id).emit("challenge_over", {
          message: "You have run out of challenges",
        });
        io.to(opponentId).emit("challenge_over", {
          message: "You have run out of challenges",
        });
        return;
      }

      // Send next challenge
      const nextIndex = questionIndex + 1;
      const nextChallenge = challenges[nextIndex];

      io.to(socket.id).emit("next_challenge", {
        nextChallenge,
        currentIndex: nextIndex,
      });

      io.to(opponentId).emit("next_challenge", {
        nextChallenge,
        currentIndex: nextIndex,
      });

      // send update score
      io.to(socket.id).emit("update_score", {
        yourScore : score.get(socket.id) || 0,
        opponentScore : score.get(opponentId) || 0,
      });

      io.to(opponentId).emit("update_score", {
        yourScore : score.get(opponentId) || 0,
        opponentScore : score.get(socket.id) || 0,
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
      waitingUsers = waitingUsers.filter((s) => s.id !== socket.id);
    });
  });
};

module.exports = connection;
