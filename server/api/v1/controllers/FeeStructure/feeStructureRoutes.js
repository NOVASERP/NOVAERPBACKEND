// api/v1/controllers/admin/feeStructureRoutes.js
const express = require('express');
const router = express.Router();
const feeStructureController = require('./feeStructureController');

router.post('/createfeestructure', feeStructureController.createFeeStructure);
router.get('/getfeestructure', feeStructureController.getAllFeeStructures);
router.put('/update/:id', feeStructureController.updateFeeStructureById);

module.exports = router;