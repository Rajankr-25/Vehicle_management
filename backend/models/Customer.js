const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String },
    address: { type: String },
    membershipStatus: { type: String, enum: ['Regular', 'Premium'], default: 'Regular' },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
