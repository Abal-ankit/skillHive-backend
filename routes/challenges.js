const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const optionalVerifyToken = require('../middlewares/optionalVerifyToken');
const {
  challenge,
  getQuestionsList,
  dockerRun,
  getQuestionById,
  getAllSubmissionsByQuestionId,
  getSubmissionById,
} = require("../controllers/challengeController");

/**
 * API /api/challenges
 */
router.post("/run", verifyToken, challenge);
router.post("/questions", optionalVerifyToken, getQuestionsList);
router.get("/question/:id", optionalVerifyToken, getQuestionById);
router.post("/dockerrun", verifyToken, dockerRun);
router.get("/submissions/:id", verifyToken, getAllSubmissionsByQuestionId);
router.get("/submissionId/:id", verifyToken, getSubmissionById)

module.exports = router;
