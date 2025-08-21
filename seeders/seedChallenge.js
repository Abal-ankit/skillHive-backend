const { sequelize } = require("../models");
const Challenge = require("../models/Challenge");

const seedChallenges = async () => {
  try {
    await sequelize.sync({ alter: true });

    // Remove all old challenges
    await Challenge.destroy({ where: {} });

    const challenges = [
      {
        title: "Sum of Two Numbers",
        description:
          "Write a function that takes two numbers and returns their sum.",
        starterCode: `function add(a, b) {
  // Your code here
}`,
        testCases: [
          { input: [1, 2], expected: 3 },
          { input: [5, 7], expected: 12 },
        ],
      },
      {
        title: "Find Maximum",
        description:
          "Write a function that takes an array of numbers and returns the maximum value.",
        starterCode: `function findMax(arr) {
  // Your code here
}`,
        testCases: [
          { input: [[1, 2, 3, 4, 5]], expected: 5 },
          { input: [[-10, -3, -50, -7]], expected: -3 },
        ],
      },
      {
        title: "Palindrome Checker",
        description:
          "Write a function to check if a given string is a palindrome.",
        starterCode: `function isPalindrome(s) {
  // Your code here
}`,
        testCases: [
          { input: ["racecar"], expected: true },
          { input: ["hello"], expected: false },
        ],
      },
    ];

    await Challenge.bulkCreate(challenges);
    console.log("✅ Challenges reset & seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding challenges:", error);
  } finally {
    await sequelize.close();
  }
};

seedChallenges();
