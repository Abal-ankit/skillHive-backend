const sequelize = require("../config/db");
const User = require("./User");
const Challenge = require("./Challenge");
const Match = require("./Match");

// Associations
User.hasMany(Match, { as: "matches1", foreignKey: "user1Id" });
User.hasMany(Match, { as: "matches2", foreignKey: "user2Id" });
Challenge.hasMany(Match);
Match.belongsTo(User, { as: "user1", foreignKey: "user1Id" });
Match.belongsTo(User, { as: "user2", foreignKey: "user2Id" });
Match.belongsTo(Challenge);

module.exports = { sequelize, User, Challenge, Match };
