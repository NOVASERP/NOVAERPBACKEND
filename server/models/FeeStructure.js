const mongoose = require('mongoose');

const FeeComponentSchema = new mongoose.Schema({
  type: { type: String, required: true },               // e.g., Tuition Fee
  amount: { type: Number, required: true },             // e.g., 2000
  frequency: {
    type: String,
    enum: ['Monthly', 'Yearly', 'Quarterly', 'Half-Yearly'],
    required: true
  }
});

const FeeStructureSchema = new mongoose.Schema({
  className: { type: String, required: true },          // e.g., "6A"
  term: { type: String, required: true },               // e.g., "2025-26"
  feeBreakdown: [FeeComponentSchema],                   // All fee parts
  totalMonthly: { type: Number, default: 0 },           // Calculated from above
  totalYearly: { type: Number, default: 0 },
  totalQuarterly: { type: Number, default: 0 },
  totalHalfYearly: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeeStructure', FeeStructureSchema);
