// controllers/fineController.js
const StudentFine = require('../../../../models/StudentFine'); // Your StudentFine model
const User = require('../../../../models/userModel'); // Your Student model (to verify student existence)

// 1. Apply a fine to a student
exports.applyStudentFine = async (req, res) => {
  try {
    const { studentId, academicYear, fineName, reason, amount, dueDate } = req.body;
    // Assuming 'leviedBy' comes from authenticated user in req.user
    // IMPORTANT: Replace `req.user._id` with actual user ID from your authentication middleware
    const leviedBy = req.user ? req.user._id : null; 

    // Basic validation
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
      leviedBy // The ID of the staff/admin who levied the fine
    });

    await newFine.save();
    res.status(201).json({ message: 'Fine applied successfully', data: newFine });
  } catch (error) {
    console.error('Error applying fine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Get all fines for a specific student for an academic year (outstanding or all)
exports.getStudentFines = async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;
    // Optional query parameter to filter by status (e.g., /students/:id/:year?status=Outstanding)
    const { status } = req.query;
    const query = { studentId, academicYear };
    if (status) query.status = status;

    const fines = await StudentFine.find(query)
                                   .populate('studentId', 'firstName lastName admissionNumber currentClass.class') // Populate student info
                                   .sort({ leviedDate: -1 }); // Sort by newest first

    res.status(200).json({ message: 'Student fines fetched successfully', data: fines });
  } catch (error) {
    console.error('Error fetching student fines:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. Mark a fine as paid
exports.markFineAsPaid = async (req, res) => {
  try {
    const { fineId } = req.params;
    const updatedFine = await StudentFine.findByIdAndUpdate(
      fineId,
      { status: 'Paid', paidDate: new Date() },
      { new: true } // Return the updated document
    );
    if (!updatedFine) return res.status(404).json({ message: 'Fine not found.' });
    res.status(200).json({ message: 'Fine marked as paid successfully', data: updatedFine });
  } catch (error) {
    console.error('Error marking fine as paid:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. Waive a fine (mark as waived)
exports.waiveFine = async (req, res) => {
  try {
    const { fineId } = req.params;
    // IMPORTANT: Replace `req.user._id` with actual user ID from your authentication middleware
    const waivedBy = req.user ? req.user._id : null; 

    const updatedFine = await StudentFine.findByIdAndUpdate(
      fineId,
      { status: 'Waived', waivedBy: waivedBy, paidDate: null }, // Set paidDate to null if waived
      { new: true } // Return the updated document
    );
    if (!updatedFine) return res.status(404).json({ message: 'Fine not found.' });
    res.status(200).json({ message: 'Fine waived successfully', data: updatedFine });
  } catch (error) {
    console.error('Error waiving fine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 5. Get ALL student fines for a specific academic year (for lists in frontend)
exports.getAllStudentFines = async (req, res) => {
    try {
        const { academicYear } = req.params;
        const fines = await StudentFine.find({ academicYear })
                                        .populate('studentId', 'firstName lastName admissionNumber currentClass.class') // Populate student info
                                        .sort({ leviedDate: -1 }); // Sort by newest first
        res.status(200).json({ message: 'All student fines fetched successfully', data: fines });
    } catch (error) {
        console.error('Error fetching all student fines:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};