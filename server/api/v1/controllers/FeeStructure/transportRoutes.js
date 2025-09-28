// novaerp_backend/server/api/v1/controllers/FeeStructure/transportRoutes.js
const express = require('express');
const router = express.Router();

// **** THIS IS THE CRUCIAL CORRECTION ****
// From 'FeeStructure' folder, go up two levels (../../) to 'v1',
// then down into 'controllers' to find 'transportController'.
const transportController = require('./transportController'); 

// --- Transport Route Management ---
// POST /api/v1/transport/routes
router.post('/routes', transportController.createTransportRoute);

// GET /api/v1/transport/routes
router.get('/routes', transportController.getAllTransportRoutes);

// PUT /api/v1/transport/routes/:id
router.put('/routes/:id', transportController.updateTransportRoute);

// DELETE /api/v1/transport/routes/:id
router.delete('/routes/:id', transportController.deleteTransportRoute);


module.exports = router;