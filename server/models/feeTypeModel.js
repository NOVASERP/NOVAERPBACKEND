const mongoose = require('mongoose');

const FeeTypeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Tuition Fee
  category: { type: String, enum: ['Academic', 'Transport', 'Activity', 'Material', 'Exam', 'Misc', 'Optional'], required: true },
  isOptional: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('feetypes', FeeTypeSchema);
