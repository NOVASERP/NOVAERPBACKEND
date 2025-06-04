const express = require('express');
const router = express.Router();
const uiController = require('./uiController');

// Define your routes on the router
router.post("/uiController", uiController.createUiTheme);
// router.get("/getStudentList", staffController.getAllStudent);

module.exports = router;
