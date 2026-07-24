const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to create a JWT token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token expires in 7 days
  );
};

// POST /api/auth/login - Admin login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // Compare the entered password with the hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create and return token
    const token = createToken(user);
    res.json({ token, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/profile - Get logged-in admin profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/auth/profile - Update admin profile
const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true } // return the updated document
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/auth/change-password - Change admin password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Check current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login, getProfile, updateProfile, changePassword };
