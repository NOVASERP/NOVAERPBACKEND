const express = require('express');
const router = express.Router();
const Attendance = require('../../../../models/Attendance');
const Users = require('../../../../models/userModel');

router.post('/mark', async (req, res) => {
  try {
    const { qrcode_id } = req.body;
    if (!qrcode_id) return res.status(400).json({ message: 'QR code is required' });

    // Find user by QR code
    const _id=qrcode_id;
    const user = await Users.findOne({ _id });
    console.log("User found:", user,_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const todayDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Check if attendance record exists for this user
    let record = await Attendance.findOne({ userId: user._id });

    // If not found, create a new one
    if (!record) {
      record = new Attendance({
        userId: user._id,
        attendanceRecords: {}
      });
    }

    // Check if today's attendance already marked
    if (record.attendanceRecords.has(todayDate)) {
      return res.status(200).json({ message: 'Attendance already marked for today' });
    }

    // Mark attendance
    const { sessionYear } = req.body;
    record.attendanceRecords.set(todayDate, {
        sessionYear: sessionYear||'N/A', // Assuming sessionYear is stored in user model
      status: 'P',
      qrCode: user.qrCode
    });

    await record.save();

    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
