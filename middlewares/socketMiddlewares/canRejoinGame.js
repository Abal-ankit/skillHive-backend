const {games} = require("../../config/store.js");
const {Game} = require("../../models/index.js");

const canRejoinGame = async (userId) => {
    const gameId = games.get(userId);
    console.log("GameId: ", gameId);

    // user is not part of any game
    if(!gameId) {
        return false;
    }


    // check game db to verify ongoing game
    const record = await Game.findOne({
        where: {
            user_id : userId, game_id : gameId
        },
        attributes : ["createdAt"]
    });

    // verify how much time has elapsed. If one hour is elapsed, then the game is over. Otherwise, game is ongoing.
    const now = new Date();
    const givenTime = new Date(record.createdAt);
    
    console.log("Now : " + now);
    console.log("GivenTime : " + givenTime);
    const timeElapsed = Math.floor((now - givenTime) / 1000);

    console.log("Time elapsed: " + timeElapsed);
    if(timeElapsed > 6000) {
        return false;
    }

    return true;
}

module.exports = canRejoinGame;
