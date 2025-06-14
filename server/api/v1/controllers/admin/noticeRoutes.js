const express = require('express');
const router = express.Router();
const noticeController = require('./noticeController');

// Define your routes on the router
router.post("/createNotice", noticeController.createNotice);
router.get("/getNoticesByRole", noticeController.getNoticesByRole);
router.get("/getNoticeHistory", noticeController.getNoticeHistory);
module.exports = router;
