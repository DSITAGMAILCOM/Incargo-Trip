const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
        type: String,
        required: true,
         },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Transport", "Hotel", "Shopping", "Other"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);