const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Challenge = sequelize.define('Challenge', {
    title : {
        type : DataTypes.STRING,
        allowNull : false,
    },

    description : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    starterCode : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    testCases : {
        type : DataTypes.JSON,
        allowNull : false
    }
});

module.exports = Challenge;
