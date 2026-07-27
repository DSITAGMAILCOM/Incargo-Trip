const express = require('express');
const mongoose = require('mongoose');
const Packing = require('../models/Packing');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const packingItems = await Packing.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packingItems.length,
            packingItems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch packing items',
            error: error.message,
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid packing item id',
            });
        }

        const packingItem = await Packing.findById(id);

        if (!packingItem) {
            return res.status(404).json({
                success: false,
                message: 'Packing item not found',
            });
        }

        res.status(200).json({
            success: true,
            packingItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch packing item',
            error: error.message,
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { packingType, packingDescription, packingImage } = req.body;

        const newPackingItem = await Packing.create({
            packingType,
            packingDescription,
            packingImage,
        });

        res.status(201).json({
            success: true,
            message: 'Packing item created successfully',
            packingItem: newPackingItem,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create packing item',
            error: error.message,
        });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid packing item id',
            });
        }

        const updatedPackingItem = await Packing.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedPackingItem) {
            return res.status(404).json({
                success: false,
                message: 'Packing item not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Packing item updated successfully',
            packingItem: updatedPackingItem,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update packing item',
            error: error.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid packing item id',
            });
        }

        const deletedPackingItem = await Packing.findByIdAndDelete(id);

        if (!deletedPackingItem) {
            return res.status(404).json({
                success: false,
                message: 'Packing item not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Packing item deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete packing item',
            error: error.message,
        });
    }
});

module.exports = router;
