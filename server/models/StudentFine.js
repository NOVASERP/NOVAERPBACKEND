// models/StudentFine.js
const mongoose = require('mongoose');

const studentFineSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students', // Corrected: refer to your 'students' model
    required: true,
    index: true
  },
  academicYear: {
    type: String, // e.g., "2024-2025"
    required: true,
    index: true
  },
  fineName: { // e.g., "Late Fee", "Library Damage", "Discipline Fine"
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    trim: true
  },
  amount: { // The amount of this specific fine instance
    type: Number,
    required: true,
    min: 0
  },
  leviedDate: { // When the fine was issued
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: { // When the fine is due
    type: Date,
    // Default 7 days from levied date, but can be overridden
    default: function() { return new Date(this.leviedDate.getTime() + 7 * 24 * 60 * 60 * 1000); }
  },
  status: {
    type: String,
    enum: ['Outstanding', 'Paid', 'Waived'],
    default: 'Outstanding'
  },
  paidDate: { type: Date }, // When the fine was paid
  waivedBy: { // If waived, who waived it
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff' // Assuming 'Staff' model
  },
  leviedBy: { // Staff/Admin who levied the fine
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff', // Assuming 'Staff' model
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('StudentFine', studentFineSchema);