const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { // e.g., "RJ14-AB-1234"
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    vehicleType: { // e.g., "Bus", "Van", "Minibus"
        type: String,
        required: true,
        enum: ['Bus', 'Van', 'Minibus', 'Car', 'Other']
    },
    capacity: { // Max passengers vehicle can hold
        type: Number,
        required: true,
        min: 1
    },
    driverName: {
        type: String,
        trim: true
    },
    driverContact: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);