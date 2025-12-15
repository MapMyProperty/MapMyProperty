const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Basic route for generation
router.post("/generate-project", aiController.generateProject);

module.exports = router;
