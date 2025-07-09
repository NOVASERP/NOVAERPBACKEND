const express = require('express');
const router = express.Router();
const userLoginController = require('./userLoginController');
const userController = require('./ID_Card/userController');
const verifyToken=require('../../../helpers/jwtauth')
// Define your routes on the router
router.post("/signIn", userLoginController.Login);
// router.get("/getStudentList", staffController.getAllStudent);
router.get("/getProfileDetails",verifyToken,userLoginController.getProfileDetails);
 router.get("/getAllWithDetails", userController.getAllUsersWithDetails);
module.exports = router;