const questionModel = require("../mongodbModels/Question.js");
const {users, games, match_details} = require("../config/store.js");
const handleJoinRoom = require("./joinRoomhandler.js");
const handleStartGame = require("./startGameHandler.js");
const handleCreateRoom = require("./createRoomHandler.js");
const handleLeaveRoom = require("./leaveRoomHandler.js");
const handleFindMatch = require("./findMatchHandler.js")
const handleSuccessfulSubmit = require("./successfulSubmitHandler.js");
const canChallenge = require("../middlewares/socketMiddlewares/canChallenge.js");
const canRejoinGame = require("../middlewares/socketMiddlewares/canRejoinGame.js");

let waitingRooms = [];
let challenges = [];

const loadChallenges = async () => {
  if(challenges.length > 0)
    return;

  challenges = await questionModel.find();
}

const connection = (io) => {
  io.on("connection", async (socket) => {
    console.log("Client connected: " +  socket.user.userName + " " + socket.id);

    // Loading the challenges from the db
    loadChallenges();

    users.set(socket.user.userId, {"socketId" : socket.id, "userName" : socket.user.userName});

    /**
     * Joining an existing game
     */
    const canRejoin = await canRejoinGame(socket.user.userId);
    if (canRejoin === true) {
      const gameId = games.get(socket.user.userId);

      // get websocket room identity
      console.log("gameId in canRejoin: " + gameId);
      // join to the room
      socket.join(gameId);
      
      const gameDetails = match_details.get(gameId);

      console.log("gameDetails: ", gameDetails);
      const { questionIndex, ...newScore } = gameDetails;

      if (questionIndex > challenges.length - 1) {
        // End of challenges
        games.delete(socket.user.userId);
        io.to(gameId).emit("challenge_over", {
          score: newScore,
        });
        
        io.socketsLeave(gameId);
        return;
      }

      const nextChallenge = challenges[questionIndex];
      
      // console.log("nextChallenge: ", nextChallenge);
      io.to(socket.id).emit("next_challenge", {
        roomId : gameId,
        challenge : nextChallenge,
        currentIndex: questionIndex,
        score: newScore,
      });

      console.log("next_challenge has been sent");
    }

    // When a user looks for a match
    socket.on("find_match", async () => {
      handleFindMatch(io, socket, waitingRooms);
    });

    // When user successfully submits
    socket.on("successful_submit", ({ questionIndex }) => {
      handleSuccessfulSubmit(
        io,
        socket,
        questionIndex,
        challenges
      );
    });

    /**
     * Create a room
     */
    socket.on("createRoom", ({opponentId}) => {
      canChallenge(io, socket, opponentId, handleCreateRoom);
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
    socket.on("startGame", () => {
      const rooms = [...socket.rooms].filter((r) => r !== socket.id);

      handleStartGame(io, rooms[0], challenges);
    });

    /**
     * Client Disconneting
     */
    socket.on("disconnecting", () => {
      console.log("Disconnecting:", socket.user.userName, " ", socket.id);

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

    /**
     * Client Disconnected
     */
    socket.on('disconnect', () => {
      console.log("client disconnected");
    })
  });
};

module.exports = connection;
