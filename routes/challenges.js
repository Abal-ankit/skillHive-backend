const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const challengeController = require("../controllers/challengeController");


router.get("/", verifyToken, challengeController);

module.exports = router;
