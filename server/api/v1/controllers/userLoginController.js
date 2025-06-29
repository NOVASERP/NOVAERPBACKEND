const responseMessage = require("../../../../assets/responseMessage");
const statusCode = require("../../../../assets/responceCode");
const statusType = require("../../../enum/status");
const userType = require("../../../enum/userType");
const bcrypt = require("bcryptjs");
const commonFunction = require("../../../helpers/utils");
const { staffServices } = require("../services/staff/staffServices");
const {
  createStaff,
  findStaff,
  findStaffData,
  deleteStaff,
  updateStaff,
  countTotalStaff,
} = staffServices;
const { userServices } = require("../services/userServices");
const {
  createUser,
  findUser,
  findUserData,
  deleteUser,
  updateUser,
  countTotalUser,
} = userServices;

exports.Login = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    const isUserExist = await findUser({ userId: userId });
    
    if (!isUserExist) {
      console.log({userId:userId});
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
    return res
      .status(statusCode.OK)
      .json({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.LOGIN,
        result: {isUserExist,getToken},
      });
  } catch (error) {
    return next(error);
  }
};