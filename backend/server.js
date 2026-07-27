const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware - parse JSON bodies and allow cross-origin requests from React frontend
app.use(cors());
app.use(express.json());

// Connect all routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/destinations", require("./routes/destinationRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/trips", require("./Trip_Apis/Routes/tripRoutes"));
app.use("/api/trip", require("./Trip_Apis/Routes/tripRoutes")); // Alias for singular route request
app.use("/api/packing", require("./Trip_Apis/Routes/packingRoutes"));

// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "Incargo API server is running" });
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("DB connection error:", err));
