const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Match = sequelize.define('Match', {
    status : {
        type : DataTypes.STRING,
        defaultValue : 'pending'
    },

    winnerId : {
        type : DataTypes.INTEGER,
        allowNull : true
    }
});


module.exports = Match;
