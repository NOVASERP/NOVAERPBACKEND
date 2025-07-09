const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  attendanceRecords: {
    type: Map,
    of: new mongoose.Schema({
    sessionYear: { type: String, required: true },
      status: { type: String, default: 'A' },
      qrCode: { type: String }
    }),
    default: {}
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
