const { User } = require("../models");

const getUserProfile = async (req, res) => {
  try {
    const {userId} = req.user;
    console.log(userId);

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "createdAt"], // adjust fields as needed
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { getUserProfile };
