const { sequelize } = require("../models");
const Challenge = require("../models/Challenge");

const seedChallenges = async () => {
  try {
    await sequelize.sync({ alter: true });

    const challenges = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        starterCode: `function twoSum(nums, target) {
  // Your code here
}`,
        testCases: [
          { input: [[2, 7, 11, 15], 9], output: [0, 1] },
          { input: [[3, 2, 4], 6], output: [1, 2] },
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
          { input: ["racecar"], output: true },
          { input: ["hello"], output: false },
        ],
      },
    ];

    await Challenge.bulkCreate(challenges);
    console.log("✅ Challenges seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding challenges:", error);
  } finally {
    await sequelize.close();
  }
};

seedChallenges();
