const mongoose = require("mongoose");

// Itinerary schema - day-by-day trip plan created by users
const itinerarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    destination: { type: String },
    days: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);
