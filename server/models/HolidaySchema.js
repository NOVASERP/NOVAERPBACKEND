const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  title: { type: String, required: true },                  // Holiday name (e.g., Diwali)
  date: { type: Date, required: true },                     // Holiday date
  academicYear: { type: String, required: true },           // e.g., "2025-26"
  description: { type: String },                            // Optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Holiday', HolidaySchema);
