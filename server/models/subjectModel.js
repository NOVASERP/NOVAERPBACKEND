const mongoose = require('mongoose');
mongoose.pluralize(null);
const subjectSchema = new mongoose.Schema({
  name: String,
  code: String,
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
}, { timestamps: true });

module.exports = mongoose.model('Subjects', subjectSchema);
