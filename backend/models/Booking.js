const mongoose = require("mongoose");

// Booking schema - records when a user books a destination
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
