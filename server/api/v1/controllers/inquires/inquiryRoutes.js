// backend/routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
  getSingleInquiry
} = require('./inquiryController');

// All routes must point to valid handler functions
router.post('/create', createInquiry);
router.get('/getall', getInquiries);
router.get('/get/:id', getSingleInquiry);
router.put('/update/:id', updateInquiry);
router.delete('/delete/:id', deleteInquiry);

module.exports = router;
