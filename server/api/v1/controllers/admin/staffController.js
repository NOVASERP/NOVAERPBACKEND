const responseMessage = require("../../../../../assets/responseMessage");
const statusCode = require("../../../../../assets/responceCode");
const statusType = require("../../../../enum/status");
const userType = require("../../../../enum/userType");
const bcrypt = require("bcryptjs");
const commonFunction = require("../../../../helpers/utils");
const { staffServices } = require("../../services/staff/staffServices");
const {
  createStaff,
  findStaff,
  findStaffData,
  deleteStaff,
  updateStaff,
  countTotalStaff,
} = staffServices;
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  findUserData,
  deleteUser,
  updateUser,
  countTotalUser,
} = userServices;

exports.staffCreation = async (req, res, next) => {
  try {
    let { data } = req.body;
    const requestData = JSON.parse(data);
    console.log("data.email====", data);

    const isEmailExist = await findStudent({ email: requestData.email });
    if (isEmailExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        responseMessage: responseMessage.EMAIL_EXIST,
        result: isEmailExist,
      });
    }
    const result = await createStudent(requestData);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.STUDENT_ADDED,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.Login = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    const isUserExist = await findStaff({ userId: userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.EMAIL_NOT_FOUND,
      });
    }
    const isMatch = await bcrypt.compare(password, isUserExist.password);
    if (!isMatch) {
      return res
        .status(statusCode.OK)
        .json({
          statusCode: statusCode.badRequest,
          responseMessage: responseMessage.EMAIL_NOT_FOUND,
        });
    }
    const payload = {
      _id: isUserExist._id,
      role: isUserExist.role,
    };
    const getToken = await commonFunction.getToken(payload);
    // await updateStaff(
    //   { _id: isUserExist._id },
    //   { lastLogin: new Date(), loginCount: { $inc: 1 } }
    // );

    return res
      .status(statusCode.OK)
      .json({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.LOGIN,
        result: {isUserExist,getToken},
      });
  } catch (error) {
    return next(error);
  }
};
