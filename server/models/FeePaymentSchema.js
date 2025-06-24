const mongoose = require('mongoose');

const FeeComponentPaymentSchema = new mongoose.Schema({
  type: { type: String, required: true },              // e.g., "Tuition Fee"
  frequency: { 
    type: String, 
    enum: ['Monthly', 'Yearly', 'Quarterly', 'Half-Yearly'], 
    required: true 
  },
  monthOrTerm: { type: String, required: true },       // e.g., "June", "Q1", "2025-26"
  amountPaid: { type: Number, required: true },        // Paid amount
  paymentMode: { type: String, required: true },       // e.g., "UPI", "Cash"
  receiptNumber: { type: String },                     // Optional receipt number
  remarks: { type: String }                            // Optional note
});

const FeePaymentSchema = new mongoose.Schema({
 SerialNo: { type: Number, required: true, unique: true }, // Unique serial number for each payment
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
 admissionNumber: { type: String, required: true }, // e.g., "ADM2025266A01"
  class: { type: String, required: true }, 
  section:{type:String, required:true},             // e.g., "6A"
  academicYear: { type: String, required: true },           // e.g., "2025-26"
  feeStructureId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure', required: true },
  paymentDetails: [FeeComponentPaymentSchema],              // Each paid component
  totalPaid: { type: Number, required: true },
  totalDue: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeePayment', FeePaymentSchema);
