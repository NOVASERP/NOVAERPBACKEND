// api/v1/controllers/admin/feeStructureController.js
const FeeStructure = require('../../../../models/FeeStructure');
const { validationResult } = require('express-validator');
const Class = require('../../../../models/classModel');



exports.createFeeStructure = async (req, res) => {
  try {
    // Validation (optional - can be removed if not used)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { className, term, feeBreakdown } = req.body;

    // Check if structure already exists
    const existing = await FeeStructure.findOne({ className, term });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Fee structure already exists for this class and term.'
      });
    }

    // Initialize totals
    let totalMonthly = 0, totalYearly = 0, totalQuarterly = 0, totalHalfYearly = 0;

    // Loop through fee components to calculate totals
    feeBreakdown.forEach(item => {
      if (item.frequency === 'Monthly') totalMonthly += item.amount;
      else if (item.frequency === 'Yearly') totalYearly += item.amount;
      else if (item.frequency === 'Quarterly') totalQuarterly += item.amount;
      else if (item.frequency === 'Half-Yearly') totalHalfYearly += item.amount;
    });

    // Create structure
    const feeStructure = new FeeStructure({
      className,
      term,
      feeBreakdown,
      totalMonthly,
      totalYearly,
      totalQuarterly,
      totalHalfYearly
    });

    const savedStructure = await feeStructure.save();

    res.status(201).json({
      success: true,
      message: 'Fee structure created successfully',
      data: savedStructure
    });
  } catch (error) {
    console.error('Error in createFeeStructure:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating fee structure'
    });
  }
};


exports.getAllFeeStructures = async (req, res) => {
  try {
    const structures = await FeeStructure.find().sort({ term: -1, className: 1 });
    res.status(200).json({
      success: true,
      count: structures.length,
      data: structures
    });
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching fee structures'
    });
  }
};

exports.updateFeeStructureById = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, term, feeBreakdown } = req.body;

    const updatedFeeStructure = await FeeStructure.findByIdAndUpdate(
      id,
      {
        className,
        term,
        feeBreakdown
      },
      { new: true }
    );

    if (!updatedFeeStructure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Fee structure updated successfully',
      data: updatedFeeStructure
    });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

