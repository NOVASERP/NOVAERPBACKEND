const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  class: { type: String, required: true }, // e.g., "6-A" or class ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', SubjectSchema);
