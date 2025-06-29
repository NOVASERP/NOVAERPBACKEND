const FeePayment = require('../../../../models/FeePaymentSchema');
const FeeStructure = require('../../../../models/FeeStructure');
const Student = require('../../../../models/studentModel'); // Make sure this model is used if needed, otherwise it's just an import

// Helper: Function to get the next serial number
async function getNextSerialNo() {
  try {
    const latestPayment = await FeePayment.findOne().sort({ SerialNo: -1 }).lean();
    // Use .lean() for faster retrieval as we only need the data, not a full Mongoose document

    // If there's a latest payment, increment its SerialNo. Otherwise, start from 1.
    return latestPayment ? latestPayment.SerialNo + 1 : 1;
  } catch (error) {
    console.error("Error generating SerialNo:", error);
    // Depending on your error handling strategy, you might want to throw an error,
    // or return a default/fallback value. For simplicity, let's throw.
    throw new Error("Failed to generate Serial Number for fee payment.");
  }
}

// Helper: Calculate total paid from paymentDetails
const calculateTotalPaid = (paymentDetails) => {
  return paymentDetails.reduce((sum, comp) => sum + (comp.amountPaid || 0), 0);
};

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
    console.log(feeStructureId);

    // Check required fields
    if (!userId || !admissionNumber || !studentClass || !section || !academicYear || !feeStructureId || !paymentDetails?.length) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Get fee structure
    const feeStructure = await FeeStructure.findById(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    // Total paid from paymentDetails
    const totalPaid = calculateTotalPaid(paymentDetails);
    if (totalPaid <= 0) {
      return res.status(400).json({ success: false, message: 'Total paid must be greater than zero' });
    }
    console.log(feeStructure.totalMonthly, feeStructure.totalYearly, feeStructure.totalQuarterly, feeStructure.totalHalfYearly, totalPaid);

    // Calculate due
    const totalDue =
      (feeStructure.totalMonthly || 0) +
      (feeStructure.totalYearly || 0) +
      (feeStructure.totalQuarterly || 0) +
      (feeStructure.totalHalfYearly || 0) - totalPaid;

    // Generate SerialNo INSIDE the async function
    const SerialNo = await getNextSerialNo(); // <--- CALL THE HELPER HERE

    // Save to DB
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
      totalDue,
      createdAt: new Date() // Ensure createdAt is set
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: 'Fee payment recorded successfully',
      data: newPayment
    });
  } catch (err) {
    console.error('Error in createFeePayment:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
    console.error('Error in getAllPayments:', err); // Log error for debugging
    res.status(500).json({ success: false, message: 'Internal server error' });
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
    console.error('Error in getPaymentById:', err); // Log error for debugging
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET single payment by user ID
exports.getpaymentbyuserid = async (req, res) => {
  try {
    const payment = await FeePayment.find({ userId: req.params.id })
      // .populate('userId')
      .populate('feeStructureId');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    console.error('Error in getPaymentById:', err); // Log error for debugging
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};