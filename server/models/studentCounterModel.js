//studentCounterModel.js
 
const mongoose = require('mongoose');
mongoose.pluralize(null);
 
const studentCounterSchema = new mongoose.Schema({
  year:     { type: Number, required: true },
  classId:  { type: mongoose.Types.ObjectId, ref: 'Class', required: true },
  section:  { type: String, required: true },
  seq:      { type: Number, default: 0 },
}, { versionKey: false, timestamps: false });
 
// Ensure one counter doc per (year, class, section)
studentCounterSchema.index({ year: 1, classId: 1, section: 1 }, { unique: true });
 
 
module.exports = mongoose.model("studentCounters", studentCounterSchema);