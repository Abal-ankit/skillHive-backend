const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getProfileByUserName,
  followUser,
  getFollower,
  getFollowing,
  getSearchResults,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const optionVerifyToken = require("../middlewares/optionalVerifyToken");

/**
 * API GET /api/user/
 */
router.get("/profile", verifyToken, getUserProfile);
router.get("/username/:userName", optionVerifyToken, getProfileByUserName);
router.post("/follow", verifyToken, followUser);
router.get("/:id/followers", optionVerifyToken, getFollower);
router.get("/:id/followings", optionVerifyToken, getFollowing);
router.post("/search", getSearchResults)

module.exports = router;
