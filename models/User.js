const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },

    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    rank : {
        type : DataTypes.STRING,
        defaultValue : 'Begineer'
    },
    points : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
});

module.exports = User;
