const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");




// Create an admin profile api
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const admin = new Admin({
      name,
      email,
      password,
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET admin profile
router.get("/profile", async (req, res) => {
  try {
    const admin = await Admin.findOne();

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE admin profile
router.put("/profile", async (req, res) => {
  try {
    const admin = await Admin.findOneAndUpdate(
      {},
      req.body,
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// CHANGE PASSWORD
router.put("/change-password", async (req, res) => {
  try {
    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.password = req.body.password;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;