const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Vehicle = require('../models/Vehicle');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create new booking
// @route   POST /api/bookings
router.post('/', protect, async (req, res) => {
    const { vehicleId, paymentAmount } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.stock <= 0) {
        return res.status(400).json({ message: 'Vehicle unavailable' });
    }

    const booking = new Booking({
        user: req.user._id,
        vehicle: vehicleId,
    });

    const createdBooking = await booking.save();

    // Create simulated payment
    const payment = new Payment({
        booking: createdBooking._id,
        amount: paymentAmount,
    });
    await payment.save();

    // Reduce stock
    vehicle.stock -= 1;
    await vehicle.save();

    res.status(201).json(createdBooking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
router.get('/mybookings', protect, async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('vehicle').populate('assignedEmployee', 'name position');
    res.json(bookings);
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
router.get('/', protect, admin, async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'name email').populate('vehicle').populate('assignedEmployee', 'name position');
    res.json(bookings);
});

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
router.put('/:id/status', protect, admin, async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.status = status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

// @desc    Assign employee to booking (Admin only)
// @route   PUT /api/bookings/:id/assign
router.put('/:id/assign', protect, admin, async (req, res) => {
    const { employeeId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.assignedEmployee = employeeId;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

// @desc    Delete booking (Admin only)
// @route   DELETE /api/bookings/:id
router.delete('/:id', protect, admin, async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
        await booking.deleteOne();
        res.json({ message: 'Booking removed' });
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

module.exports = router;
