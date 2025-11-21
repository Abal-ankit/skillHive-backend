module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define("Match", {
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Match;
};
