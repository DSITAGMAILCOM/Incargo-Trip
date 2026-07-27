const express = require("express");
const router = express.Router();
const { getBookings, updateBookingStatus, deleteBooking } = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET all bookings
router.get("/", getBookings);

// Admin status update & delete
router.put("/:id/status", protect, adminOnly, updateBookingStatus);
router.delete("/:id", protect, adminOnly, deleteBooking);

module.exports = router;
