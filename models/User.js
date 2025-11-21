"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rank: {
      type: DataTypes.STRING,
      defaultValue: "Beginner",
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull:true
    }
  });

  // 🔹 Define future associations here if needed
  // User.associate = (models) => {
  //   models.User.hasMany(models.Match);
  // };

  return User;
};
