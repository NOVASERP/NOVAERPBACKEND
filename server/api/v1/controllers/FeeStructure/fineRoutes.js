// routes/fineRoutes.js (This file should be loaded e.g. as app.use('/api/v1/fines', fineRoutes);)
const express = require('express');
const router = express.Router();
const StudentFine = require('../models/StudentFine'); // New Schema
const User = require('../models/userModel'); // Your Student model

// Apply a fine to a student
router.post('/students/apply', async (req, res) => {
  try {
    const { studentId, academicYear, fineName, reason, amount, dueDate } = req.body;
    // Assuming 'leviedBy' comes from authenticated user (req.user._id)
    const leviedBy = req.user ? req.user._id : null; // Replace with actual user context

    if (!studentId || !academicYear || !fineName || amount === undefined || amount < 0) {
      return res.status(400).json({ message: 'Missing or invalid required fields for applying fine.' });
    }

    // Optional: Verify studentId exists
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    const newFine = new StudentFine({
      studentId,
      academicYear,
      fineName,
      reason,
      amount,
      leviedDate: new Date(), // Set fine date to now
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days if not provided
      leviedBy
    });

    await newFine.save();
    res.status(201).json({ message: 'Fine applied successfully', data: newFine });
  } catch (error) {
    console.error('Error applying fine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all fines for a specific student for an academic year (outstanding or all)
router.get('/students/:studentId/:academicYear', async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;
    // Optional query parameter to filter by status (e.g., /students/:id/:year?status=Outstanding)
    const { status } = req.query;
    const query = { studentId, academicYear };
    if (status) query.status = status;

    const fines = await StudentFine.find(query).sort({ leviedDate: -1 }); // Sort by newest first
    res.status(200).json({ message: 'Student fines fetched successfully', data: fines });
  } catch (error) {
    console.error('Error fetching student fines:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark a fine as paid
router.put('/mark-paid/:fineId', async (req, res) => {
  try {
    const { fineId } = req.params;
    const updatedFine = await StudentFine.findByIdAndUpdate(
      fineId,
      { status: 'Paid', paidDate: new Date() },
      { new: true }
    );
    if (!updatedFine) return res.status(404).json({ message: 'Fine not found' });
    res.status(200).json({ message: 'Fine marked as paid successfully', data: updatedFine });
  } catch (error) {
    console.error('Error marking fine as paid:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Waive a fine
router.put('/waive/:fineId', async (req, res) => {
  try {
    const { fineId } = req.params;
    const waivedBy = req.user ? req.user._id : null; // Replace with actual user context

    const updatedFine = await StudentFine.findByIdAndUpdate(
      fineId,
      { status: 'Waived', waivedBy: waivedBy, paidDate: null }, // Set paidDate to null if waived
      { new: true }
    );
    if (!updatedFine) return res.status(404).json({ message: 'Fine not found' });
    res.status(200).json({ message: 'Fine waived successfully', data: updatedFine });
  } catch (error) {
    console.error('Error waiving fine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;