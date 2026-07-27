const express = require('express');
const Trip = require('../models/trip');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips',
      error: error.message,
    });
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findOne({ tripId });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip',
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      tripId,
      title,
      destination,
      startDate,
      endDate,
      description,
      budget,
      travelers,
      status,
      createdBy,
      tags,
    } = req.body;

    const existingTrip = await Trip.findOne({ tripId });
    if (existingTrip) {
      return res.status(400).json({
        success: false,
        message: 'Trip id already exists',
      });
    }

    const newTrip = await Trip.create({
      tripId,
      title,
      destination,
      startDate,
      endDate,
      description,
      budget,
      travelers,
      status,
      createdBy,
      tags,
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: newTrip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create trip',
      error: error.message,
    });
  }
});

router.put('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const updatedTrip = await Trip.findOneAndUpdate({ tripId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTrip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      trip: updatedTrip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update trip',
      error: error.message,
    });
  }
});

router.delete('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const deletedTrip = await Trip.findOneAndDelete({ tripId });

    if (!deletedTrip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete trip',
      error: error.message,
    });
  }
});

module.exports = router;