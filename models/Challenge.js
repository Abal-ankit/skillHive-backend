"use strict";

module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define(
    "Challenge",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      starterCode: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      testCases: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "Challenges",
      timestamps: true,
    }
  );

  return Challenge;
};
