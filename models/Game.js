module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    "Game",
    {
      game_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      tableName: "games",
      timestamps: true, // Sequelize will auto-create createdAt & updatedAt
      underscored: false, // createdAt, updatedAt (default camelCase)
    }
  );

  return Game;
};
