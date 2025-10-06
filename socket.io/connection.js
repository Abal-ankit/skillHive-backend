const { Challenge } = require("../models");
const {users} = require("../config/store.js");
const handleJoinRoom = require("./joinRoomhandler.js");
const handleStartGame = require("./startGameHandler.js");
const handleCreateRoom = require("./createRoomHandler.js");
const handleLeaveRoom = require("./leaveRoomHandler.js");
const handleFindMatch = require("./findMatchHandler.js")
const handleSuccessfulSubmit = require("./successfulSubmitHandler.js");
const canChallenge = require("../middlewares/socketMiddlewares/canChallenge.js");

let waitingRooms = [];
let challenges = [];

const loadChallenges = async () => {
  if(challenges.length > 0)
    return;

  challenges = await Challenge.findAll();
}

const connection = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Loading the challenges from the db
    loadChallenges();

    // console.log(socket.user.userName);
    users.set(socket.user.userId, {"socketId" : socket.id, "userName" : socket.user.userName});

    // When a user looks for a match
    socket.on("find_match", async () => {
      handleFindMatch(io, socket, waitingRooms);
    });

    // When user successfully submits
    socket.on("successful_submit", ({ questionIndex, roomIdentity }) => {
      handleSuccessfulSubmit(
        io,
        socket,
        questionIndex,
        roomIdentity,
        challenges
      );
    });

    /**
     * Create a room
     */
    socket.on("createRoom", ({roomIdentity, opponentId}) => {
      canChallenge(io, socket, roomIdentity, opponentId, handleCreateRoom);
    });

    /**
     * User joins a room 
     * */ 
    socket.on("joinRoom", ({roomIdentity}) => {
      handleJoinRoom(io, socket, roomIdentity);
    });

    /**
     * User leaves a room
     */
    socket.on("leaveRoom", ({roomIdentity}) => {
      handleLeaveRoom(socket, roomIdentity);
    });

    /**
     * Start the game
     */
    socket.on("startGame", ({roomIdentity}) => {
      handleStartGame(io, roomIdentity, challenges);
    });

    socket.on("disconnecting", () => {
      console.log("Disconnecting:", socket.id);

      if (!socket.user || !users.has(socket.user.userId)) return;

      const { userName } = users.get(socket.user.userId);
      users.delete(socket.user.userId);

      for (const room of socket.rooms) {
        if (room !== socket.id) {
          io.to(room).emit("Message", {
            message: `${userName} has left the room`,
          });
        }
      }
    });

  });
};

module.exports = connection;
