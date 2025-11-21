// models/follow.js
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define("Follow", {
    following_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    follower_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

  return Follow;
};
