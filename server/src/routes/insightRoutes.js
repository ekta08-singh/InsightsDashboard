const express = require("express");
const router = express.Router();
const { getInsights, getMeta } = require("../controllers/insightController");

router.get("/", getInsights);       // /api/insights
router.get("/meta", getMeta);       // /api/insights/meta

module.exports = router;
