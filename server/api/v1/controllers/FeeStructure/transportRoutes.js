// routes/transportRoutes.js (This file should be loaded e.g. as app.use('/api/v1/transport', transportRoutes);)
const express = require('express');
const router = express.Router();
const TransportRoute = require('../models/TransportRoute'); // New Schema
const StudentTransport = require('../models/StudentTransport'); // New Schema
const User = require('../models/userModel'); // Your Student model (to check if student exists)

// --- Transport Routes Management (Admin/Staff) ---
// Create a new transport route
router.post('/routes', async (req, res) => {
  try {
    const newRoute = new TransportRoute(req.body);
    await newRoute.save();
    res.status(201).json({ message: 'Transport route created successfully', route: newRoute });
  } catch (error) {
    console.error('Error creating transport route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all transport routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await TransportRoute.find({});
    res.status(200).json({ message: 'Transport routes fetched successfully', data: routes });
  } catch (error) {
    console.error('Error fetching transport routes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a transport route
router.put('/routes/:id', async (req, res) => {
  try {
    const updatedRoute = await TransportRoute.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRoute) return res.status(404).json({ message: 'Transport route not found' });
    res.status(200).json({ message: 'Transport route updated successfully', route: updatedRoute });
  } catch (error) {
    console.error('Error updating transport route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a transport route
router.delete('/routes/:id', async (req, res) => {
  try {
    const deletedRoute = await TransportRoute.findByIdAndDelete(req.params.id);
    if (!deletedRoute) return res.status(404).json({ message: 'Transport route not found' });
    // Optional: Also consider setting related StudentTransport records to 'Discontinued'
    await StudentTransport.updateMany({ transportRouteId: req.params.id }, { status: 'Discontinued' });
    res.status(200).json({ message: 'Transport route and associated student transport records discontinued successfully' });
  } catch (error) {
    console.error('Error deleting transport route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- Student Transport Assignment ---
// Assign/Update transport for a student for a specific academic year
router.post('/students/assign', async (req, res) => {
  try {
    const { studentId, academicYear, transportRouteId, pickupPoint, monthlyCharge, effectiveStartDate, effectiveEndDate, status } = req.body;

    if (!studentId || !academicYear || !transportRouteId || !pickupPoint || monthlyCharge === undefined || !effectiveStartDate) {
      return res.status(400).json({ message: 'Missing required fields for transport assignment.' });
    }

    // Optional: Verify studentId and transportRouteId exist
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    const route = await TransportRoute.findById(transportRouteId);
    if (!route) return res.status(404).json({ message: 'Transport route not found.' });

    let studentTransportRecord = await StudentTransport.findOneAndUpdate(
      { studentId, academicYear }, // Find by student and academic year
      {
        transportRouteId,
        pickupPoint,
        monthlyCharge,
        effectiveStartDate,
        effectiveEndDate,
        status: status || 'Active', // Default to Active if not provided
        // assignedBy: req.user._id // Assuming you have user authentication and req.user
      },
      { new: true, upsert: true, runValidators: true } // upsert: true will create if not found
    );

    res.status(200).json({ message: 'Student transport assigned/updated successfully', data: studentTransportRecord });

  } catch (error) {
    console.error('Error assigning student transport:', error);
    // Handle unique index error (student already has active transport for the year)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Student already has an active transport assignment for this academic year.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's transport details for a specific academic year
router.get('/students/:studentId/:academicYear', async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;
    const studentTransport = await StudentTransport.findOne({ studentId, academicYear }).populate('transportRouteId');
    if (!studentTransport) return res.status(404).json({ message: 'Student transport details not found for this academic year.' });
    res.status(200).json({ message: 'Student transport details fetched successfully', data: studentTransport });
  } catch (error) {
    console.error('Error fetching student transport details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student's transport assignment status/dates
router.put('/students/update-assignment/:id', async (req, res) => {
    try {
        const updatedRecord = await StudentTransport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRecord) return res.status(404).json({ message: 'Student transport record not found.' });
        res.status(200).json({ message: 'Student transport assignment updated successfully', data: updatedRecord });
    } catch (error) {
        console.error('Error updating student transport assignment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;