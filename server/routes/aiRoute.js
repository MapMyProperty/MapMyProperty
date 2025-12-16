const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Basic route for generation
router.post("/generate-project", aiController.generateProject);
router.post("/generate-blog", aiController.generateBlog);
router.post("/generate-project-blog", aiController.generateProjectBlog);

module.exports = router;
