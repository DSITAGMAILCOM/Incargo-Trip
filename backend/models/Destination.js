const mongoose = require("mongoose");

// Destination schema - travel destinations that users can book
const destinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
