const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../multerConfig");

/**
 * API /api/auth/
 */
router.post("/register", upload.single("profilePic"), authController.register);
router.post("/login", authController.login);
router.get("/profile", verifyToken, authController.getProfile);
router.post(
  "/profileUpdate",
  verifyToken,
  upload.single("profilePic"),
  authController.updateProfile
);

module.exports = router;
