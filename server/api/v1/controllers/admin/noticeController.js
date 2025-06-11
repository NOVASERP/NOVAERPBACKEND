const responseMessage = require("../../../../../assets/responseMessage");
const statusCode = require("../../../../../assets/responceCode");
const statusType = require("../../../../enum/status");
const userType = require("../../../../enum/userType");
const bcrypt = require("bcryptjs");
const commonFunction = require("../../../../helpers/utils");
const { noticeBrdServices } = require("../../services/noticeServices");
const {
  createNotice,
  findNotice,
  findNoticeData,
  deleteNotice,
  updateNotice,
  countTotalNotice,
} = noticeBrdServices;

exports.createNotice = async (req, res, next) => {
  try {
    const {
      title,
      message,
      attachmentUrl,
      targetRoles,
      visibleFrom,
      visibleTill,
      publishedBy,
    } = req.body;
    // const publishedBy = req.user._id; // assuming JWT or session-based login

    const notice = await createNotice({
      title,
      message,
      attachmentUrl,
      targetRoles,
      visibleFrom,
      visibleTill,
      publishedBy,
    });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.NOTICE_CREATE_SUCCESS,
      result: notice,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNoticesByRole = async (req, res, next) => {
  try {
    const userRole = req.query.role; // 'STUDENT' | 'TEACHER' | etc.
    const today = new Date();

    const notices = await findNoticeData({
      targetRoles: { $in: [userRole] },
      isActive: true,
      status: statusType.ACTIVE,
    });
    if (!notices || notices.length < 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: notices,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNoticeHistory=async(req,res,next)=>{
  try {
    const result=await findNoticeData();
    if (!result || result.length < 0) {
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
}