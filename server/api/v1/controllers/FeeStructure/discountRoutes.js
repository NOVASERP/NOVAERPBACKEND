// routes/discountRoutes.js (This file should be loaded e.g. as app.use('/api/v1/discounts', discountRoutes);)
const express = require('express');
const router = express.Router();
const StudentDiscount = require('../../../../models/StudentDiscount'); // New Schema
const User = require('../../../../models/userModel'); // Your Student model

// Add a discount to a student
router.post('/students/add', async (req, res) => {
  try {
    const { studentId, academicYear, discountName, description, amount, percentage, appliesTo, effectiveFrom, effectiveTo } = req.body;

    // Validate required fields and discount type
    if (!studentId || !academicYear || !discountName || (!amount && !percentage)) {
      return res.status(400).json({ message: 'Missing required fields for adding discount.' });
    }
    if ((amount !== undefined && amount > 0) && (percentage !== undefined && percentage > 0)) {
        return res.status(400).json({ message: 'Cannot specify both amount and percentage for a discount.' });
    }

    // Optional: Verify studentId exists
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    const newDiscount = new StudentDiscount({
      studentId,
      academicYear,
      discountName,
      description,
      amount: amount || 0,
      percentage: percentage || 0,
      appliesTo,
      effectiveFrom,
      effectiveTo,
      // appliedBy: req.user._id // Assuming authentication context
    });

    await newDiscount.save();
    res.status(201).json({ message: 'Discount added successfully', data: newDiscount });
  } catch (error) {
    console.error('Error adding discount:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all discounts for a specific student for an academic year (active or all)
router.get('/students/:studentId/:academicYear', async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;
    // Optional query parameter to filter by status (e.g., /students/:id/:year?status=Active)
    const { status } = req.query;
    const query = { studentId, academicYear };
    if (status) query.status = status;

    const discounts = await StudentDiscount.find(query).sort({ effectiveFrom: -1 }); // Sort by newest first
    res.status(200).json({ message: 'Student discounts fetched successfully', data: discounts });
  } catch (error) {
    console.error('Error fetching student discounts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a specific discount for a student
router.put('/:discountId', async (req, res) => {
  try {
    const { discountId } = req.params;
    const updatedDiscount = await StudentDiscount.findByIdAndUpdate(discountId, req.body, { new: true, runValidators: true });
    if (!updatedDiscount) return res.status(404).json({ message: 'Discount not found' });
    res.status(200).json({ message: 'Discount updated successfully', data: updatedDiscount });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change status of a discount (e.g., from Pending to Active, or Active to Inactive)
router.patch('/status/:discountId', async (req, res) => {
  try {
    const { discountId } = req.params;
    const { status, approvedBy, approvedDate } = req.body; // Status and approval details

    const updateFields = { status };
    if (status === 'Active') {
        updateFields.approvedBy = approvedBy; // Assuming req.user._id
        updateFields.approvedDate = approvedDate || new Date();
    } else if (status === 'Inactive' || status === 'Expired') {
        updateFields.effectiveTo = updateFields.effectiveTo || new Date(); // Set end date if deactivating
    }

    const updatedDiscount = await StudentDiscount.findByIdAndUpdate(discountId, updateFields, { new: true, runValidators: true });
    if (!updatedDiscount) return res.status(404).json({ message: 'Discount not found.' });
    res.status(200).json({ message: `Discount status updated to ${status} successfully`, data: updatedDiscount });
  } catch (error) {
    console.error('Error updating discount status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a discount (use with caution, better to deactivate)
router.delete('/:discountId', async (req, res) => {
  try {
    const deletedDiscount = await StudentDiscount.findByIdAndDelete(req.params.discountId);
    if (!deletedDiscount) return res.status(404).json({ message: 'Discount not found.' });
    res.status(200).json({ message: 'Discount deleted successfully.' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;