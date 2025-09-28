// routes/fineRoutes.js (This is the file your app.js will 'app.use' for /api/v1/fines)
const express = require('express');
const router = express.Router();
const fineController = require('./fineController'); // Import the controller

// --- Fine Management ---
// POST /api/v1/fines/students/apply
router.post('/students/apply', fineController.applyStudentFine);

// GET /api/v1/fines/students/:studentId/:academicYear
router.get('/students/:studentId/:academicYear', fineController.getStudentFines);

// PUT /api/v1/fines/mark-paid/:fineId
router.put('/mark-paid/:fineId', fineController.markFineAsPaid);

// PUT /api/v1/fines/waive/:fineId
router.put('/waive/:fineId', fineController.waiveFine);

// GET /api/v1/fines/all-fines/:academicYear (NEW API for frontend lists)
router.get('/all-fines/:academicYear', fineController.getAllStudentFines);


module.exports = router;