const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  challenge,
  getQuestionsList,
  dockerRun,
  getQuestionById,
} = require("../controllers/challengeController");

/**
 * API /api/challenges
 */
router.post("/run", verifyToken, challenge);
router.post("/questions", getQuestionsList);
router.get("/question/:id", getQuestionById);
router.post("/dockerrun", dockerRun);

module.exports = router;
