// models/StudentTransport.js
const mongoose = require('mongoose');

const studentTransportSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students', // Corrected: refer to your 'students' model
    required: true,
    index: true // Index for efficient lookups by student
  },
  academicYear: {
    type: String, // e.g., "2024-2025" - consistent with Class/FeeStructure
    required: true,
    index: true // Index for efficient lookups by academic year
  },
  transportRouteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportRoute', // Corrected: refer to your 'TransportRoute' model
    required: true
  },
  pickupPoint: { // Specific pickup point chosen by the student on this route
    type: String,
    trim: true,
    required: true
  },
  monthlyCharge: { // The actual monthly fee applied to THIS student for THIS route
    type: Number,
    required: true,
    min: 0
    // This value would typically be copied from transportRouteId.monthlyFee at the time of assignment,
    // allowing for route fee changes without affecting historical student charges.
  },
  // It's often better to track transport for the duration of the academic year, or specific months
  // If transport is billed monthly for specific months, consider an array of months or a separate ledger
  // For simplicity here, assuming an active period within an academic year
  effectiveStartDate: { // When transport service begins for this assignment
    type: Date,
    required: true
  },
  effectiveEndDate: { // When transport service ends for this assignment (e.g., end of academic year or discontinuation date)
    type: Date,
    default: null // Can be null if ongoing for the academic year
  },
  status: { // Active, Inactive, Discontinued (to manage service lifecycle)
    type: String,
    enum: ['Active', 'Discontinued', 'Pending'],
    default: 'Pending' // e.g., needs admin approval before becoming Active
  },
  assignedBy: { // Optional: Staff/Admin who assigned this transport
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff' // Assuming you have a Staff or Admin user model
  }
}, { timestamps: true });

// Ensure a student has only one ACTIVE transport record per academic year
// This index will prevent duplicate assignments for the same academic year
studentTransportSchema.index(
  { studentId: 1, academicYear: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'Active' } }
);

module.exports = mongoose.model('StudentTransport', studentTransportSchema);