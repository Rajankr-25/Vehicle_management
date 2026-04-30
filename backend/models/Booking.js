const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Delivered'], default: 'Pending' },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    bookingDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
