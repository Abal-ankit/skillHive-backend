const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  challenge,
  getQuestionsList,
} = require("../controllers/challengeController");

router.post("/run", verifyToken, challenge);
router.post("/questions", getQuestionsList);

module.exports = router;
