const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { challenge } = require("../controllers/challengeController");


// router.get("/", verifyToken, challengeController);
router.post("/run", verifyToken, challenge);
// router.post("/run", challenge);

module.exports = router;
