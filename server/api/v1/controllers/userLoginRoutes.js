const express = require('express');
const router = express.Router();
const userLoginController = require('./userLoginController');

// Define your routes on the router
router.post("/signIn", userLoginController.Login);
// router.get("/getStudentList", staffController.getAllStudent);

module.exports = router;
