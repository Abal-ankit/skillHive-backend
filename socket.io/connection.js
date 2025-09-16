const { Challenge } = require("../models");
const {users} = require("../config/store.js");
const handleJoinRoom = require("./joinRoomhandler.js");
const handleStartGame = require("./startGameHandler.js");
const handleCreateRoom = require("./createRoomHandler.js");
const handleLeaveRoom = require("./leaveRoomHandler.js");
const handleFindMatch = require("./findMatchHandler.js")
const handleSuccessfulSubmit = require("./successfulSubmitHandler.js");

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
      handleCreateRoom(io, socket, roomIdentity, opponentId);
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

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
      // waitingUsers = waitingUsers.filter((s) => s.id !== socket.id);
    });
  });
};

module.exports = connection;
