const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all vehicles
// @route   GET /api/vehicles
router.get('/', async (req, res) => {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404).json({ message: 'Vehicle not found' });
    }
});

// @desc    Add vehicle (Admin only)
// @route   POST /api/vehicles
router.post('/', protect, admin, async (req, res) => {
    const { name, type, price, stock, description, image } = req.body;
    const vehicle = new Vehicle({ name, type, price, stock, description, image });
    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
});

// @desc    Update vehicle (Admin only)
// @route   PUT /api/vehicles/:id
router.put('/:id', protect, admin, async (req, res) => {
    const { name, type, price, stock, description, image } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
        vehicle.name = name || vehicle.name;
        vehicle.type = type || vehicle.type;
        vehicle.price = price || vehicle.price;
        vehicle.stock = stock || vehicle.stock;
        vehicle.description = description || vehicle.description;
        vehicle.image = image || vehicle.image;

        const updatedVehicle = await vehicle.save();
        res.json(updatedVehicle);
    } else {
        res.status(404).json({ message: 'Vehicle not found' });
    }
});

// @desc    Delete vehicle (Admin only)
// @route   DELETE /api/vehicles/:id
router.delete('/:id', protect, admin, async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        await vehicle.deleteOne();
        res.json({ message: 'Vehicle removed' });
    } else {
        res.status(404).json({ message: 'Vehicle not found' });
    }
});

module.exports = router;
