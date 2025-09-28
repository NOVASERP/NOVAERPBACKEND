// controllers/discountController.js
const StudentDiscount = require('../../../../models/StudentDiscount'); // Your StudentDiscount model
const User = require('../../../../models/userModel'); // Your Student model (to verify student existence)

// 1. Add a discount to a student
exports.addStudentDiscount = async (req, res) => {
  try {
    const { studentId, academicYear, discountName, description, amount, percentage, appliesTo, effectiveFrom, effectiveTo } = req.body;
    // Assuming 'appliedBy' comes from authenticated user in req.user
    // IMPORTANT: Replace `req.user._id` with actual user ID from your authentication middleware
    const appliedBy = req.user ? req.user._id : null; 

    // Validate required fields and discount type
    if (!studentId || !academicYear || !discountName || (amount === undefined && percentage === undefined)) {
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
      appliedBy // The ID of the staff/admin who applied the discount
    });

    await newDiscount.save();
    res.status(201).json({ message: 'Discount added successfully', data: newDiscount });
  } catch (error) {
    console.error('Error adding discount:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Get all discounts for a specific student for an academic year (active or all)
exports.getStudentDiscounts = async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;
    // Optional query parameter to filter by status (e.g., /students/:id/:year?status=Active)
    const { status } = req.query;
    const query = { studentId, academicYear };
    if (status) query.status = status;

    const discounts = await StudentDiscount.find(query)
                                          .populate('studentId', 'firstName lastName admissionNumber currentClass.class') // Populate student info
                                          .sort({ effectiveFrom: -1 }); // Sort by newest first
    res.status(200).json({ message: 'Student discounts fetched successfully', data: discounts });
  } catch (error) {
    console.error('Error fetching student discounts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. Update a specific discount for a student
exports.updateStudentDiscount = async (req, res) => {
  try {
    const { discountId } = req.params;
    const updatedDiscount = await StudentDiscount.findByIdAndUpdate(discountId, req.body, { new: true, runValidators: true });
    if (!updatedDiscount) return res.status(404).json({ message: 'Discount not found' });
    res.status(200).json({ message: 'Discount updated successfully', data: updatedDiscount });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. Change status of a discount (e.g., from Pending to Active, or Active to Inactive)
exports.changeDiscountStatus = async (req, res) => {
  try {
    const { discountId } = req.params;
    const { status } = req.body; // New status (e.g., 'Active', 'Inactive', 'Expired')
    // Assuming `approvedBy` comes from authenticated user in req.user
    const approvedBy = req.user ? req.user._id : null; 

    const updateFields = { status };
    if (status === 'Active') {
        updateFields.approvedBy = approvedBy; 
        updateFields.approvedDate = new Date(); // Set approval date
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
};

// 5. Delete a discount (use with caution, better to deactivate/change status)
exports.deleteDiscount = async (req, res) => {
  try {
    const deletedDiscount = await StudentDiscount.findByIdAndDelete(req.params.discountId);
    if (!deletedDiscount) return res.status(404).json({ message: 'Discount not found.' });
    res.status(200).json({ message: 'Discount deleted successfully.' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 6. Get ALL student discounts for a specific academic year (for lists in frontend)
exports.getAllStudentDiscounts = async (req, res) => {
    try {
        const { academicYear } = req.params;
        const discounts = await StudentDiscount.find({ academicYear })
                                               .populate('studentId', 'firstName lastName admissionNumber currentClass.class') // Populate student info
                                               .sort({ effectiveFrom: -1 }); // Sort by newest first
        res.status(200).json({ message: 'All student discounts fetched successfully', data: discounts });
    } catch (error) {
        console.error('Error fetching all student discounts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};