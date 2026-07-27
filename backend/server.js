const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware - parse JSON bodies and allow cross-origin requests from React frontend
app.use(cors());
app.use(express.json());

// Connect all API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/destinations", require("./routes/destinationRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/trips", require("./Trip_Apis/Routes/tripRoutes"));
app.use("/api/trip", require("./Trip_Apis/Routes/tripRoutes")); // Alias for singular route request
app.use("/api/packing", require("./Trip_Apis/Routes/packingRoutes"));

// Serve frontend static assets in production (Render)
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Incargo API server is running" });
  });
}

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/incargo";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection warning:", err.message);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
