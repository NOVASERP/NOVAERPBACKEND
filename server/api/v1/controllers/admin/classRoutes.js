const express = require('express');
const router = express.Router();
const classController = require('./classController');

// Define your routes on the router
router.post("/createClass", classController.createClass);
router.get("/getAllClass", classController.getClass);

module.exports = router;
