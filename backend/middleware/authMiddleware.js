const jwt = require("jsonwebtoken");

// This middleware runs before protected routes
// It checks if the request has a valid JWT token
const protect = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  // Extract the actual token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to the request
    next(); // allow the request to continue
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Extra middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = { protect, adminOnly };
