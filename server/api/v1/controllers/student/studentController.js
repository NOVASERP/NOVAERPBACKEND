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

exports.studentCreation = async (req, res, next) => {
  try {
    let { data } = req.body;
    const isEmailExist = await findStudent({ email: data.email });
    if (isEmailExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        responseMessage: responseMessage.EMAIL_EXIST,
        result: isEmailExist,
      });
    }
    const admissionDateStr = new Date(data?.classes?.[0]?.admissionDate);
    const year = admissionDateStr.getFullYear();
    const count = await countTotalStudent({
      "classes.admissionDate": { $gte: `01-01-${year}`, $lte: `31-12-${year}` },
    });
    const incrementedCount = count + 1;
    const paddedCount = String(incrementedCount).padStart(3, "0");
    data.admissionNumber = `ADM${year}${paddedCount}`;
    const result = await createStudent(data);
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

