// api/v1/controllers/admin/feeStructureRoutes.js
const express = require('express');
const router = express.Router();
const feeStructureController = require('./feeStructureController');

// Create fee structure
router.post('/createfeestructure', feeStructureController.createFeeStructure);

// Get all fee structures
router.get('/getfeestructure', feeStructureController.getAllFeeStructures);
router.put('/update/:id', feeStructureController.updateFeeStructureById);
// // Get fee structure by class
// router.get('/class/:classId', feeStructureController.getFeeStructuresByClass);

// // Get single fee structure
// router.get('/:id', feeStructureController.getFeeStructureById);

// // Update fee structure
// router.put('/:id', feeStructureController.updateFeeStructure);

// // Delete fee structure
// router.delete('/:id', feeStructureController.deleteFeeStructure);

module.exports = router;