const FeePayment = require('../../../../models/FeePaymentSchema');
const FeeStructure = require('../../../../models/FeeStructure');
const Student = require('../../../../models/studentModel'); // Keep this if you plan to use it later, otherwise it's just an import

// Helper: Function to get the next serial number
async function getNextSerialNo() {
    try {
        const latestPayment = await FeePayment.findOne().sort({ SerialNo: -1 }).lean();
        return latestPayment ? latestPayment.SerialNo + 1 : 1;
    } catch (error) {
        console.error("Error generating SerialNo:", error);
        throw new Error("Failed to generate Serial Number for fee payment.");
    }
}

// Helper: Calculate total paid from paymentDetails array
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

        // 1. Basic Validation
        if (!userId || !admissionNumber || !studentClass || !section || !academicYear || !feeStructureId || !paymentDetails?.length) {
            return res.status(400).json({ success: false, message: 'Missing required fields for fee payment.' });
        }

        // 2. Calculate the total amount paid in *this specific transaction*
        const actualTotalPaidForThisTransaction = calculateTotalPaid(paymentDetails);
        if (actualTotalPaidForThisTransaction <= 0) {
            return res.status(400).json({ success: false, message: 'Total amount paid must be greater than zero.' });
        }

        // 3. Get the Fee Structure for the academic year
        const feeStructure = await FeeStructure.findById(feeStructureId);
        if (!feeStructure) {
            return res.status(404).json({ success: false, message: 'Associated fee structure not found.' });
        }

        // Calculate the total annual due from the fee structure
        // This is the fixed total amount for the year from the structure itself
        const totalAnnualFeeStructureAmount =
            (feeStructure.totalMonthly || 0) +
            (feeStructure.totalYearly || 0) +
            (feeStructure.totalQuarterly || 0) +
            (feeStructure.totalHalfYearly || 0);

        // 4. Calculate the OVERALL amount paid for this student in this academic year *before* this transaction
        const previousPaymentsForThisYear = await FeePayment.find({
            userId: userId,
            academicYear: academicYear
        }).lean(); // Use .lean() for efficiency as we only need sums

        const totalPaidBeforeThisTransaction = previousPaymentsForThisYear.reduce((sum, payment) => sum + (payment.totalPaid || 0), 0);

        // 5. Calculate the new OVERALL total paid and remaining due for the academic year
        const newOverallTotalPaidForYear = totalPaidBeforeThisTransaction + actualTotalPaidForThisTransaction;
        const newRemainingDueForYear = Math.max(0, totalAnnualFeeStructureAmount - newOverallTotalPaidForYear);

        // 6. Generate SerialNo
        const SerialNo = await getNextSerialNo();

        // 7. Save the new payment record
        const newPayment = new FeePayment({
            SerialNo,
            userId,
            admissionNumber,
            class: studentClass,
            section,
            academicYear,
            feeStructureId,
            paymentDetails,
            totalPaid: actualTotalPaidForThisTransaction, // Amount paid in *this* transaction
            totalDue: totalAnnualFeeStructureAmount,    // The *original* total due for the academic year
            remainingDue: newRemainingDueForYear,       // The *remaining outstanding balance* after this transaction
            createdAt: new Date()
        });

        await newPayment.save();

        res.status(201).json({
            success: true,
            message: 'Fee payment recorded successfully.',
            data: newPayment,
            // You can also send the updated overall status to the frontend
            currentRemainingDueForAcademicYear: newRemainingDueForYear,
            currentOverallPaidForAcademicYear: newOverallTotalPaidForYear
        });

    } catch (err) {
        console.error('Error in createFeePayment:', err);
        res.status(500).json({ success: false, message: 'Internal server error during fee payment processing.' });
    }
};

// GET all payments (optionally filter) - No changes needed here, as it retrieves what's saved
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

// GET single payment by ID - No changes needed here
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

// GET single payment by user ID (getpaymentbyuserid) - No changes needed here, as it retrieves what's saved
const mongoose = require('mongoose');

exports.getpaymentbyuserid = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId first
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        // Convert string ID to ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        const payment = await FeePayment.find({ userId: objectId })
            .populate('feeStructureId');

        if (!payment || payment.length === 0) {
            return res.status(404).json({ success: false, message: 'No payments found for this user' });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        console.error('Error in getpaymentbyuserid:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};