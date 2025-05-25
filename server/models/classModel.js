const mongoose = require('mongoose');
mongoose.pluralize(null);
const classSchema = new mongoose.Schema({
  name: String,
  section: String,
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
