const match_details = new Map();
let matches = [];
/**
 * Maps a socket to the user in database
 * FORMAT => {socket.id => userName}
 */
const users = new Map();

module.exports = { match_details, matches, users };
