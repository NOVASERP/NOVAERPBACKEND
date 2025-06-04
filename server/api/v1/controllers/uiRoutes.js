const express = require('express');
const router = express.Router();
const uiController = require('./uiController');

// Define your routes on the router
router.post("/uiController", uiController.createUiTheme);
router.get("/getUiDesign", uiController.getUiDesign);

module.exports = router;
