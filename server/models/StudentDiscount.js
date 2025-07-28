// models/StudentDiscount.js
const mongoose = require('mongoose');

const studentDiscountSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students', // Corrected: refer to your 'students' model
    required: true,
    index: true
  },
  academicYear: {
    type: String, // e.g., "2024-2025"
    required: true,
    index: true
  },
  discountName: { // e.g., "Sibling Discount", "Merit Scholarship", "Staff Child Discount"
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  amount: { // Fixed amount discount
    type: Number,
    default: 0,
    min: 0 // Discount amount cannot be negative
  },
  percentage: { // Percentage discount (0-100)
    type: Number,
    default: 0,
    min: 0, max: 100 // Percentage must be between 0 and 100
  },
  // Specifies which fees this discount applies to.
  // Make sure these match your FeeType names or a consistent enum.
  appliesTo: {
    type: String,
    enum: ['All Fees', 'Tuition Fee', 'Transport Fee', 'Admission Fee', 'Library Fee', 'Exam Fee', 'Other Annual Fees'], // Extended based on common school fees
    default: 'All Fees'
  },
  // If the discount is for specific duration
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date, default: null }, // Can be null for indefinite or till academic year end
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Expired', 'Pending'], // 'Pending' for approval
    default: 'Pending'
  },
  appliedBy: { // User who applied the discount for auditing
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff' // Assuming 'Staff' model for admin/staff users
  },
  approvedBy: { // Optional: if discounts need approval
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  approvedDate: { type: Date }
}, { timestamps: true });

// Custom validator to ensure either amount or percentage is provided, but not both or none
studentDiscountSchema.pre('validate', function(next) {
  if (this.amount > 0 && this.percentage > 0) {
    next(new Error('Cannot specify both amount and percentage for a discount.'));
  } else if (this.amount === 0 && this.percentage === 0) {
    next(new Error('Must specify either an amount or a percentage for the discount.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('StudentDiscount', studentDiscountSchema);