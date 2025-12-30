const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getInsights, getMeta } = require("../controllers/insightController");

router.get("/", protect, getInsights);
router.get("/meta", protect, getMeta);

module.exports = router;
