const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year: String, // e.g., "2024-2025"
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
