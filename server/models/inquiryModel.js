// ✅ Updated Admission Inquiry Model (Mongoose)

const mongoose = require('mongoose');

const admissionInquirySchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    parentName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },

    // Changed 'classId' to 'classInquiredFor' to match frontend payload
    // You might want to consider storing the class _id here if 'classInquiredFor' is just the name.
    // If you need the ObjectId reference, the frontend should send 'classId' as _id,
    // and the backend should map it to 'classInquiredFor' as the name.
    // For now, I'm assuming 'classInquiredFor' directly stores the class name string from frontend.
    classInquiredFor: { type: String, required: true },

    // Changed 'academicYear' to 'session' to match frontend payload
    session: { type: String, required: true },

    dob: { type: Date },

    // Changed 'address' to 'studentAddress' to match frontend payload
    studentAddress: { type: String },

    status: {
        type: String,
        enum: ['New', 'Followed-Up', 'Not Interested', 'Admitted'],
        default: 'New',
    },

    // Changed 'source' to 'inquirySource' to match frontend payload
    inquirySource: {
        type: String,
        enum: ['Walk-in', 'Facebook', 'Instagram', 'Website', 'Reference', 'Advertisement', 'Other'],
    },

    nextFollowUpDate: { type: Date },
    priority: { type: Boolean, default: false }, // ⭐ important inquiry
    staffName: { type: String },

    // Changed 'notes' to 'remarks' to match frontend payload
    remarks: { type: String },

    // Added 'emailId' which was present in frontend but missing here
    emailId: { type: String }, // Assuming email is optional as per frontend

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdmissionInquiry', admissionInquirySchema);