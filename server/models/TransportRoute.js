const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    stopName: {
        type: String,
        required: true,
        trim: true
    },
    time: { // Approximate time of arrival/departure at this stop (e.g., "07:30", "16:00")
        type: String,
        required: true,
        trim: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // Basic HH:MM format validation
    },
    monthlyFee: { // Optional: override route's monthlyFee for this specific stop
        type: Number,
        min: 0,
        default: null // If null, use route's default fee
    },
    coordinates: { // For mapping: [longitude, latitude]
        type: [Number], // Array of numbers
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number';
            },
            message: 'Coordinates must be an array of [longitude, latitude].'
        },
        default: undefined // Allow it to be omitted if no coordinates
    }
}, { _id: true }); // Ensure subdocuments get an _id by default

const transportRouteSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    monthlyFee: { // Standard monthly fee for this route
        type: Number,
        required: true,
        min: 0
    },
    capacity: { // Max students/passengers this route can handle
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    startDate: { // When this route officially starts operating
        type: Date,
        required: true
    },
    vehicle: { // Link to a Vehicle model, if you want to assign a specific vehicle to a route
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle', // Requires a Vehicle model
        default: null // Route can exist without an assigned vehicle initially
    },
    stops: [stopSchema], // Array of embedded stop documents

    isActive: { // To activate/deactivate routes
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('TransportRoute', transportRouteSchema);