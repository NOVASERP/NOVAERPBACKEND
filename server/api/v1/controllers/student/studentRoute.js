const express = require("express");
const router = express.Router();
const studentController = require("./studentController");
const createUploader =require('../../../../helpers/uploads')
// Define your routes on the router
const uploader = createUploader({
  fields: [
    { name: 'aadharCard', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'tc', maxCount: 1 },
    { name: 'studentImage', maxCount: 1 }
  ]})
router.post(
  "/addStudent",
  uploader,
  studentController.studentCreation
);
router.get("/getStudentList", studentController.getAllStudent);
router.get("/getStudentById/:studentId", studentController.getStudentById);

module.exports = router;
