const express = require('express');
const router = express.Router();
const feePaymentController = require('./feePaymentController');

router.post('/create', feePaymentController.createFeePayment);
router.get('/getallpayment', feePaymentController.getAllPayments);
router.get('/:id', feePaymentController.getpaymentbyuserid);

module.exports = router;
