const express = require('express');
const router = express.Router();
const FeeType = require('../../../../models/feeTypeModel');

router.get('/getFeeTypes', async (req, res) => {
  try {
    const types = await FeeType.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, data: types });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
