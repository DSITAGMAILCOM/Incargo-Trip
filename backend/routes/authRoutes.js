const express = require("express");
const router = express.Router();
const { login, getProfile, updateProfile, changePassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public route - no token needed
router.post("/login", login);

// Protected routes - require valid JWT token
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
