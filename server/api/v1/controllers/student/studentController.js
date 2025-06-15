const responseMessage = require("../../../../../assets/responseMessage");
const statusCode = require("../../../../../assets/responceCode");
const statusType = require("../../../../enum/status");
const userType = require("../../../../enum/userType");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { studentServices } = require("../../services/studentServices");
const status = require("../../../../enum/status");
const {
  createStudent,
  findStudent,
  findStudentData,
  deleteStudent,
  updateStudent,
  countTotalStudent,
} = studentServices;
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  findUserData,
  deleteUser,
  updateUser,
  countTotalUser,
} = userServices;
const defPass=process.env.DEFAULT_PASSWORD
exports.studentCreation = async (req, res, next) => {
  try {
    let { data } = req.body;
    const requestData=JSON.parse(data)
    console.log("data.email====",data);
    
    const isEmailExist = await findStudent({ email: requestData.email });
    if (isEmailExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        responseMessage: responseMessage.EMAIL_EXIST,
        result: isEmailExist,
      });
    }
console.log("defPass==",defPass);

    const hashedPassword=await bcrypt.hashSync(defPass,10);
    const admissionDateStr = new Date(requestData?.classes?.[0]?.admissionDate);
    const year = admissionDateStr.getFullYear();
    const count = await countTotalStudent({
      "classes.admissionDate": { $gte: `01-01-${year}`, $lte: `31-12-${year}` },
    });
    const incrementedCount = count + 1;
    const paddedCount = String(incrementedCount).padStart(2, "0");
    requestData.admissionNumber = `ADM${year}${requestData.currentClass.section}${requestData.currentClass.rollNumber}${paddedCount}`;
       const totalUsers = await countTotalUser(); 
    const newUserCount = totalUsers + 1;
    const paddedUserCount = String(newUserCount).padStart(6, "0");
    requestData.userId = `nova${paddedUserCount}`;
    const result = await createStudent(requestData);

    await createUser({userId:requestData.userId,password:hashedPassword,effDate:requestData.admissionDate,role:userType.STUDENT,newUserCount})
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.STUDENT_ADDED,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllStudent = async (req, res, next) => {
  try {
    const result = await findStudentData({ status: statusType.ACTIVE });
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.editStudentDetails=async  (req,res,next)=>{
  try {
    const {}=req.body;
    const isAdminExist=await a();
    if(!isAdminExist){
       return res.status(statusCode.OK).send({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.UNAUTHORIZED,
      });
    }
    const obj={

    }
    const updateProfile=await updateStudent({_id:stdId},{obj});
     return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: updateProfile,
    });
  } catch (error) {
    console.log("Error while trying to edit profile",error);
    return next(error);
    
  }
}

exports.deleteSTudents=async(req,res,next)=>{
  try {
    
  } catch (error) {
    
  }
}

