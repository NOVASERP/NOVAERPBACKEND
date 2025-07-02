// controllers/inquiryController.js
const AdmissionInquiry = require('../../../../models/inquiryModel');

// Create Inquiry
exports.createInquiry = async (req, res) => {
  try {
    const inquiry = await AdmissionInquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry });
  } catch (err) {
    // It's good practice to log the error for debugging on the server-side
    console.error("Error creating inquiry:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get Inquiries by Academic Year (now 'session') with pagination & search
exports.getInquiries = async (req, res) => {
  try {
    // Change 'academicYear' to 'session' to match the updated model
    const { session, page = 1, limit = 20, search = '' } = req.query;

    const query = {
      // Use 'session' here instead of 'academicYear'
      session,
      $or: [
        { parentName: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        // Change 'phone' to 'mobileNumber' to match the updated model
        { mobileNumber: { $regex: search, $options: 'i' } },
        // You might also want to add 'classInquiredFor' and 'emailId' to search
        { classInquiredFor: { $regex: search, $options: 'i' } },
        { emailId: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }, // Allows searching by status
        { inquirySource: { $regex: search, $options: 'i' } }, // Allows searching by source
      ]
    };

    const inquiries = await AdmissionInquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AdmissionInquiry.countDocuments(query);

    res.status(200).json({ success: true, data: inquiries, total });
  } catch (err) {
    console.error("Error fetching inquiries:", err); // Log the error
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Inquiry (e.g., status, follow-up etc.)
exports.updateInquiry = async (req, res) => {
  try {
    const updated = await AdmissionInquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating inquiry:", err); // Log the error
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    await AdmissionInquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    console.error("Error deleting inquiry:", err); // Log the error
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Inquiry (for popup/view)
exports.getSingleInquiry = async (req, res) => {
  try {
    const inquiry = await AdmissionInquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: inquiry });
  } catch (err) {
    console.error("Error fetching single inquiry:", err); // Log the error
    res.status(500).json({ success: false, message: err.message });
  }
};