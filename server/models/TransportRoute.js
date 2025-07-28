// models/TransportRoute.js
const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // Add index for faster lookup by route name if frequently queried
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
  // If you need to list stops with optional custom fees per stop
  stops: [{
    stopName: {
      type: String,
      required: true,
      trim: true
    },
    // If a stop has a different fee than the route default, uncomment below:
    // stopFee: { type: Number, min: 0 }
  }],
  isActive: { // To activate/deactivate routes
    type: Boolean,
    default: true
  }
}, { timestamps: true }); // Mongoose automatically adds createdAt and updatedAt

module.exports = mongoose.model('TransportRoute', transportRouteSchema);