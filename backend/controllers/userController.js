const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET /api/users - Get all users with search and pagination
const getUsers = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  // Build search filter - search by name or email
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
    : {};

  try {
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password") // never send passwords
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit) // pagination offset
      .limit(Number(limit));

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users - Create a new user
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: role || "user" });
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/:id - Update a user
const updateUser = async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/:id - Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
