const express = require('express');
const router = express.Router();
const staffController = require('./staffController');

// Define your routes on the router
router.post("/staffLogin", staffController.Login);
// router.get("/getStudentList", staffController.getAllStudent);

module.exports = router;
