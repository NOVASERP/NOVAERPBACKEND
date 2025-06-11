const responseMessage = require("../../../../../assets/responseMessage");
const statusCode = require("../../../../../assets/responceCode");
const statusType = require("../../../../enum/status");
const userType = require("../../../../enum/userType");
const bcrypt = require("bcryptjs");
const commonFunction = require("../../../../helpers/utils");
const { classServices } = require("../../services/classServices");
const {
  createClass,
  findClass,
  findClassData,
  deleteClass,
  updateClass,
  countTotalClass,
} = classServices;

exports.createClass = async (req, res, next) => {
  try {
    let {
      section,classNo,
      academicYear,
    } = req.body;
    // const publishedBy = req.user._id; // assuming JWT or session-based login
req.body.class=classNo;
    const result = await createClass(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CLASS_CREATE_SUCCESS,
      result: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getClass = async (req, res, next) => {
  try {
    const userRole = req.query.role; // 'STUDENT' | 'TEACHER' | etc.

    const classes = await findClassData();
    if (!classes || classes.length < 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: classes,
    });
  } catch (err) {
    next(err);
  }
};


