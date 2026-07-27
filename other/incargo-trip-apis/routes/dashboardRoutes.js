
const express = require("express");
const router = express.Router();

const Trip = require("../models/trip.js");
const Activity = require("../models/activity");
const Expense = require("../models/expense");
const Packing = require("../models/Packing");

router.get("/", async (req, res) => {
  try {
    const totalTrips = await Trip.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalExpenses = await Expense.countDocuments();
    const totalPackingItems = await Packing.countDocuments();

    const expenseSummary = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalBudget: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalBudget =
      expenseSummary.length > 0
        ? expenseSummary[0].totalBudget
        : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        totalTrips,
        totalActivities,
        totalExpenses,
        totalPackingItems,
        totalBudget,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;