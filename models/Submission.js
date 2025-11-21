module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define(
    "Submission",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submittedCode: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      result: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Submissions",
      timestamps: true,
    }
  );

  return Submission;
};
