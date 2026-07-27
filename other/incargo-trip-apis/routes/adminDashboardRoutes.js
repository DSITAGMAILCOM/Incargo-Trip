const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Destination = require("../models/Destination");
const Booking = require("../models/Booking");

router.get("/", async (req, res) => {
  try {
    // Dashboard cards
    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // You don't have an Itinerary model yet
    const totalItineraries = 0;

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly bookings
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }
          },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.month": 1
        }
      }
    ]);

    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyData = monthlyBookings.map((item) => ({
      month: months[item._id.month],
      bookings: item.bookings,
    }));

    res.json({
      totalUsers,
      totalDestinations,
      totalBookings,
      totalItineraries,
      monthlyData,
      recentBookings,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;