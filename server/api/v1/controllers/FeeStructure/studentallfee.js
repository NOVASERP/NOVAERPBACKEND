// routes/feeRoutes.js (Modify your existing fee management file if it exists)
const express = require('express');
const router = express.Router();
const FeeStructure = require('../models/FeeStructure'); // Existing Schema
const FeePayment = require('../models/FeePayment');     // Existing Schema
const FeeType = require('../models/feetypes');          // Existing Schema (model name 'feetypes')
const StudentTransport = require('../models/StudentTransport'); // New Schema
const StudentDiscount = require('../models/StudentDiscount');   // New Schema
const StudentFine = require('../models/StudentFine');       // New Schema
const User = require('../models/userModel'); // Your Student model (named 'students')

// --- API to get a consolidated student fee ledger/bill ---
// This endpoint will provide a complete financial summary for a student for a given academic year.
router.get('/students/:studentId/:academicYear/ledger', async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;

    // 1. Get student details (to determine class, etc.)
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    // Ensure student's currentClass.classId is available for fee structure lookup
    if (!student.currentClass || !student.currentClass.classId) {
        return res.status(400).json({ message: 'Student class information is missing for fee ledger calculation.' });
    }

    // 2. Get Base Fees from FeeStructure for the student's class and academic year
    const feeStructure = await FeeStructure.findOne({
      className: student.currentClass.class, // Using className from student's currentClass
      term: academicYear // Assuming 'term' in FeeStructure maps to 'academicYear'
    }).populate('feeBreakdown.type'); // Populate fee type names if 'type' is ObjectId in FeeComponentSchema

    let totalBaseFees = 0;
    const feeBreakdown = {}; // To store breakdown of each fee type (e.g., Tuition, Library, Exam)

    // Helper to initialize breakdown entry
    const initializeBreakdownEntry = (name) => {
        if (!feeBreakdown[name]) {
            feeBreakdown[name] = {
                originalAmount: 0,
                discountAmount: 0,
                fineAmount: 0,
                netAmount: 0,
                category: '' // Add category for better UI grouping
            };
        }
    };

    if (feeStructure) {
      for (const feeComp of feeStructure.feeBreakdown) {
        initializeBreakdownEntry(feeComp.type);
        feeBreakdown[feeComp.type].originalAmount += feeComp.amount;
        feeBreakdown[feeComp.type].netAmount += feeComp.amount; // Start net with original
        // Optional: Fetch FeeType to get category
        const feeTypeDetail = await FeeType.findOne({ name: feeComp.type });
        if (feeTypeDetail) {
            feeBreakdown[feeComp.type].category = feeTypeDetail.category;
        }
        totalBaseFees += feeComp.amount;
      }
    }

    // 3. Get Transport Fee (if applicable)
    const studentTransport = await StudentTransport.findOne({ studentId, academicYear, status: 'Active' });
    let totalTransportCharge = 0;
    if (studentTransport) {
      // Assuming transport fee is an annual charge based on monthlyFee, e.g., monthlyCharge * 10/12 months
      // Adjust this calculation based on your school's actual billing cycle for transport
      // Example: If transport is billed monthly for 10 academic months:
      totalTransportCharge = studentTransport.monthlyCharge * 10; // Or based on actual active months
      // If transport fee type is already in FeeStructure, combine it. Otherwise, add as a new line.
      initializeBreakdownEntry('Transport Fee');
      feeBreakdown['Transport Fee'].originalAmount += totalTransportCharge;
      feeBreakdown['Transport Fee'].netAmount += totalTransportCharge;
      feeBreakdown['Transport Fee'].category = 'Transport'; // Explicitly set category
    }

    // 4. Get Discounts
    const studentDiscounts = await StudentDiscount.find({
      studentId,
      academicYear,
      status: 'Active',
      effectiveFrom: { $lte: new Date() }, // Check if effective today or in past
      $or: [{ effectiveTo: null }, { effectiveTo: { $gte: new Date() } }] // Check if not expired
    });
    let totalDiscountsAmount = 0;

    studentDiscounts.forEach(discount => {
      let currentDiscountValue = 0;
      if (discount.amount > 0) {
        currentDiscountValue = discount.amount;
      } else if (discount.percentage > 0) {
        let baseForPercentage = 0;
        if (discount.appliesTo === 'All Fees') {
          baseForPercentage = totalBaseFees + totalTransportCharge;
        } else if (feeBreakdown[discount.appliesTo]) {
          baseForPercentage = feeBreakdown[discount.appliesTo].originalAmount;
        }
        currentDiscountValue = (baseForPercentage * discount.percentage) / 100;
      }

      totalDiscountsAmount += currentDiscountValue;

      // Apply discount to specific breakdown items for clarity
      if (discount.appliesTo === 'All Fees') {
        // Distribute proportionally or mark as a general discount
        // This is complex to distribute precisely for a "display" breakdown;
        // often better to show it as a single line item "Total Discounts" in the UI summary.
        // For individual fees, you'd need more logic. For now, we'll subtract from total.
      } else if (feeBreakdown[discount.appliesTo]) {
        initializeBreakdownEntry(discount.appliesTo); // Ensure it exists
        feeBreakdown[discount.appliesTo].discountAmount += currentDiscountValue;
        feeBreakdown[discount.appliesTo].netAmount -= currentDiscountValue;
      }
    });

    // 5. Get Fines (Outstanding)
    const studentFines = await StudentFine.find({ studentId, academicYear, status: 'Outstanding' });
    let totalOutstandingFines = 0;
    studentFines.forEach(fine => {
      totalOutstandingFines += fine.amount;
      initializeBreakdownEntry('Fines'); // Add to a 'Fines' category
      feeBreakdown['Fines'].fineAmount += fine.amount;
      feeBreakdown['Fines'].netAmount += fine.amount; // Fines increase net amount
      feeBreakdown['Fines'].category = 'Misc'; // Category for fines
    });

    // 6. Get Payments
    const studentPayments = await FeePayment.find({
        userId: studentId,
        academicYear
    }).sort({ createdAt: 1 }); // Sort by payment date
    let totalAmountPaid = 0;
    studentPayments.forEach(payment => {
      totalAmountPaid += payment.totalPaid; // Assuming totalPaid is the consolidated amount
    });

    // 7. Calculate Consolidated Totals
    const totalGrossCharges = totalBaseFees + totalTransportCharge;
    const totalPayableBeforePayments = totalGrossCharges - totalDiscountsAmount + totalOutstandingFines;
    const outstandingBalance = totalPayableBeforePayments - totalAmountPaid;

    res.status(200).json({
      message: 'Student ledger fetched successfully',
      data: {
        studentId: student._id,
        studentName: `${student.firstName} ${student.lastName || ''}`,
        academicYear,
        className: student.currentClass.class,
        section: student.currentClass.section,
        admissionNumber: student.admissionNumber,
        totalGrossCharges,
        totalDiscountsAmount,
        totalOutstandingFines,
        totalAmountPaid,
        outstandingBalance,
        feeBreakdown: Object.values(feeBreakdown), // Convert breakdown object to array for frontend table
        discounts: studentDiscounts, // Send all active discounts for detailed view
        fines: studentFines,         // Send all outstanding fines for detailed view
        payments: studentPayments    // Send all payments for detailed view
      }
    });

  } catch (error) {
    console.error('Error fetching student ledger:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;