const User = require("../models/User");
const Destination = require("../models/Destination");
const Booking = require("../models/Booking");
const Itinerary = require("../models/Itinerary");

// GET /api/dashboard - Returns all summary stats and recent bookings
const getDashboardData = async (req, res) => {
  try {
    // Count all records in parallel for speed
    const [totalUsers, totalDestinations, totalBookings, totalItineraries] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Destination.countDocuments(),
      Booking.countDocuments(),
      Itinerary.countDocuments(),
    ]);

    // Get the 5 most recent bookings for the dashboard table
    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("destination", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Build monthly booking data for the chart (last 6 months)
    const monthlyData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const count = await Booking.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      // Format month name like "Jan", "Feb", etc.
      const monthName = start.toLocaleString("default", { month: "short" });
      monthlyData.push({ month: monthName, bookings: count });
    }

    res.json({ totalUsers, totalDestinations, totalBookings, totalItineraries, recentBookings, monthlyData });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardData };
