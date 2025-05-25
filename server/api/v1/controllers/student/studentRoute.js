const express = require('express');
const router = express.Router();
const studentController = require('./studentController');

// Define your routes on the router
router.post("/addStudent", studentController.studentCreation);
router.get("/getStudentList", studentController.getAllStudent);

module.exports = router;
