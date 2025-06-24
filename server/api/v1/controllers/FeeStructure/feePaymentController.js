const FeePayment = require('../../../../models/FeePaymentSchema');
const FeeStructure = require('../../../../models/FeeStructure');
const Student = require('../../../../models/studentModel');

// Auto-generate unique Serial No (you can also do this via a counter collection)
let serialCounter = 1000;

// Helper: Calculate total paid from paymentDetails
const calculateTotalPaid = (paymentDetails) => {
  return paymentDetails.reduce((sum, comp) => sum + (comp.amountPaid || 0), 0);
};

// POST /fee-payment/create
exports.createFeePayment = async (req, res) => {
  try {
    const {
      userId,
      admissionNumber,
      class: studentClass,
      section,
      academicYear,
      feeStructureId,
      paymentDetails
    } = req.body;

    // Validate essential fields
    if (!userId || !admissionNumber || !studentClass || !academicYear || !feeStructureId || !paymentDetails) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Fetch the fee structure
    const feeStructure = await FeeStructure.findById(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    // Calculate totals
    const totalPaid = calculateTotalPaid(paymentDetails);
    const totalDue = feeStructure.totalMonthly + feeStructure.totalYearly + feeStructure.totalQuarterly + feeStructure.totalHalfYearly - totalPaid;

    // Generate unique SerialNo (use DB counter in production)
    const SerialNo = serialCounter++;
    
    // Create and save new payment record
    const newPayment = new FeePayment({
      SerialNo,
      userId,
      admissionNumber,
      class: studentClass,
      section,
      academicYear,
      feeStructureId,
      paymentDetails,
      totalPaid,
      totalDue
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: 'Fee payment recorded successfully',
      data: newPayment
    });
  } catch (err) {
    console.error('Error in createFeePayment:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
};

// GET all payments (optionally filter)
exports.getAllPayments = async (req, res) => {
  try {
    const { userId, class: studentClass, academicYear, admissionNumber } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    if (studentClass) filter.class = studentClass;
    if (academicYear) filter.academicYear = academicYear;
    if (admissionNumber) filter.admissionNumber = admissionNumber;

    const payments = await FeePayment.find(filter)
      .populate('userId', 'firstName lastName admissionNumber') // populate student basic details
      .populate('feeStructureId'); // optional

    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.id)
      .populate('userId')
      .populate('feeStructureId');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
