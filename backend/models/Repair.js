const mongoose = require('mongoose');

const repairSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleName: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['In Progress', 'Completed', 'Awaiting Parts'], default: 'In Progress' },
    repairDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Repair = mongoose.model('Repair', repairSchema);
module.exports = Repair;
