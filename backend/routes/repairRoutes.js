const express = require('express');
const router = express.Router();
const Repair = require('../models/Repair');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Add repair record
// @route   POST /api/repairs
router.post('/', protect, async (req, res) => {
    const { vehicleName, description } = req.body;
    const repair = new Repair({
        user: req.user._id,
        vehicleName,
        description
    });
    const createdRepair = await repair.save();
    res.status(201).json(createdRepair);
});

// @desc    Get user repairs
// @route   GET /api/repairs/myrepairs
router.get('/myrepairs', protect, async (req, res) => {
    const repairs = await Repair.find({ user: req.user._id });
    res.json(repairs);
});

// @desc    Get all repairs (Admin only)
// @route   GET /api/repairs
router.get('/', protect, admin, async (req, res) => {
    const repairs = await Repair.find({}).populate('user', 'name email');
    res.json(repairs);
});

// @desc    Update repair status (Admin only)
// @route   PUT /api/repairs/:id/status
router.put('/:id/status', protect, admin, async (req, res) => {
    const { status } = req.body;
    const repair = await Repair.findById(req.params.id);

    if (repair) {
        repair.status = status;
        const updatedRepair = await repair.save();
        res.json(updatedRepair);
    } else {
        res.status(404).json({ message: 'Repair record not found' });
    }
});

// @desc    Delete repair (Admin only)
// @route   DELETE /api/repairs/:id
router.delete('/:id', protect, admin, async (req, res) => {
    const repair = await Repair.findById(req.params.id);
    if (repair) {
        await repair.deleteOne();
        res.json({ message: 'Repair record removed' });
    } else {
        res.status(404).json({ message: 'Repair record not found' });
    }
});

module.exports = router;
