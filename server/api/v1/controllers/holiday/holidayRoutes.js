const express = require('express');
const router = express.Router();
const holidayController = require('./holidayController');

router.post('/create', holidayController.createHoliday);
router.get('/getall', holidayController.getHolidays);
router.delete('/delete/:id', holidayController.deleteHoliday);

module.exports = router;
