const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Follow = sequelize.define('Follow', {
    following_id : {
        type : DataTypes.BIGINT,
        allowNull : false
    },

    follower_id : {
        type : DataTypes.BIGINT,
        allowNull : false
    }
});

module.exports = Follow;
