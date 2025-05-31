const responseMessage = require("../../../../../assets/responseMessage");
const statusCode = require("../../../../../assets/responceCode");
const statusType = require("../../../../enum/status");
const userType = require("../../../../enum/userType");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {staffServices}=require("../../services/staff/staffServices");
const {createStaff,findStaff,findStaffData,deleteStaff,updateStaff,countTotalStaff}=staffServices;


// const 