const Destination = require("../models/Destination");

// GET /api/destinations - Get all destinations
const getDestinations = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const filter = search
    ? { $or: [{ title: { $regex: search, $options: "i" } }, { location: { $regex: search, $options: "i" } }] }
    : {};

  try {
    const total = await Destination.countDocuments(filter);
    const destinations = await Destination.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ destinations, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/destinations - Create a destination
const createDestination = async (req, res) => {
  const { title, location, description, price, imageUrl, category } = req.body;

  try {
    const destination = await Destination.create({ title, location, description, price, imageUrl, category });
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/destinations/:id - Update a destination
const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/destinations/:id - Delete a destination
const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDestinations, createDestination, updateDestination, deleteDestination };
