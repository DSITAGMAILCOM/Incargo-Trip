const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getDashboardData);

module.exports = router;
