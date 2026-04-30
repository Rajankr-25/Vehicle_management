const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Car', 'Bike'], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000' }, // Default luxury car image
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
