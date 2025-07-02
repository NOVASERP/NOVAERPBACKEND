const express = require('express');
const router = express.Router();
const subjectController = require('./subjectController');

router.post('/create', subjectController.createSubject);
router.get('/getall', subjectController.getAllSubjects);
router.put('/update/:id', subjectController.updateSubject);
router.delete('/delete/:id', subjectController.deleteSubject);

module.exports = router;
