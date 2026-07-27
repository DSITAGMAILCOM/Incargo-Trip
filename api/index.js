const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect all backend routes
app.use("/api/auth", require("../backend/routes/authRoutes"));
app.use("/api/users", require("../backend/routes/userRoutes"));
app.use("/api/destinations", require("../backend/routes/destinationRoutes"));
app.use("/api/bookings", require("../backend/routes/bookingRoutes"));
app.use("/api/dashboard", require("../backend/routes/dashboardRoutes"));
app.use("/api/trips", require("../backend/Trip_Apis/Routes/tripRoutes"));
app.use("/api/trip", require("../backend/Trip_Apis/Routes/tripRoutes"));
app.use("/api/packing", require("../backend/Trip_Apis/Routes/packingRoutes"));

app.get("/api", (req, res) => {
  res.json({ message: "Incargo API server is running on Vercel" });
});

// Cache MongoDB connection across serverless invocations
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      isConnected = true;
      console.log("Vercel MongoDB connected");
    } catch (err) {
      console.error("Vercel DB Connection Error:", err.message);
    }
  }
};

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
