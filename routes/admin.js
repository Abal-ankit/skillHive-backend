const express = require("express");
const addQuestion = require("../controllers/admin/addQuestionController");

const router = express.Router();

/**
 * API /api/admin/
 */

router.post("/addquestion", addQuestion);

module.exports = router;
