const express = require("express");
const router = express.Router();
const { getDestinations, createDestination, updateDestination, deleteDestination } = require("../controllers/destinationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getDestinations);
router.post("/", protect, adminOnly, createDestination);
router.put("/:id", protect, adminOnly, updateDestination);
router.delete("/:id", protect, adminOnly, deleteDestination);

module.exports = router;
