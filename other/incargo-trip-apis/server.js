console.log("=== SERVER STARTED ===");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const activityRoutes = require("./routes/activityRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");

const userRoutes = require("./routes/UserRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const tripRoutes = require("./routes/tripRoutes");
const packingRoutes = require("./routes/packingRoutes");
const authRoutes = require("./routes/authRoutes");



dotenv.config();

const app = express();




app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/activities", activityRoutes);
app.use("/api/expenses", expenseRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/packing", packingRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });