const Booking = require("../models/Booking");

// GET /api/bookings - Get all bookings with populated user and destination names
const getBookings = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate("user", "name email") // join user name and email
      .populate("destination", "title location") // join destination title
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/bookings/:id/status - Update booking status (Pending/Confirmed/Cancelled)
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email").populate("destination", "title");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/bookings/:id - Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getBookings, updateBookingStatus, deleteBooking };
