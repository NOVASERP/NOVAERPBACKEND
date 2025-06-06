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
    const { title, message, attachmentUrl, targetRoles, visibleFrom, visibleTill,publishedBy } = req.body;
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

    const notices = await Notice.find({
      targetRoles: userRole,
      isActive: true,
      visibleFrom: { $lte: today },
      visibleTill: { $gte: today }
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notices });
  } catch (err) {
    next(err);
  }
};
