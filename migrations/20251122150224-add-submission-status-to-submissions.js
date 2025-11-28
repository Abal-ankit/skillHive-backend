"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Submissions", "submissionStatus", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "attempted", // or "unsolved" if needed
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Submissions", "submissionStatus");
  },
};
