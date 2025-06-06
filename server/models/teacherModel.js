const mongoose = require('mongoose');
const status = require("../enum/status");

mongoose.pluralize(null);
const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employeeId: String,
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  status: { type: String,enum: Object.values(status), default: status.ACTIVE },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
