const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getProfileByUserName,
  followUser,
  getFollower,
  getFollowing,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

/**
 * API GET /api/user/
 */
router.get("/profile", verifyToken, getUserProfile);
router.get("/username/:userName", getProfileByUserName);
router.post("/follow", verifyToken, followUser);
router.get("/followers", verifyToken, getFollower);
router.get("/followings", verifyToken, getFollowing);

module.exports = router;
