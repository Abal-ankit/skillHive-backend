"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Submissions", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Name of the referenced table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      questionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      submittedCode: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      result: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Submissions");
  },
};
