const responseMessage = require("../../../../assets/responseMessage");
const statusCode = require("../../../../assets/responceCode");
const statusType = require("../../../enum/status");
const userType = require("../../../enum/userType");
const bcrypt = require("bcryptjs");
const commonFunction = require("../../../helpers/utils");

const { uiDesServices } = require("../services/uiDesignServices");
const {
  createUiDes,
  findUiDesign,
  findUiDesData,
  deleteUiDes,
  updateUiDes,
  countTotalUiDes,
} = uiDesServices;

exports.createUiTheme = async (req, res, next) => {
  try {
    let {
      logo,
      loginImage,
      schoolName,
      favIcon,
      buttonColor,
      address,
      websiteUrl,
      email,
      contactNo,
      hoverColor,
      sliderColor,
      cardColor,
      navbarColor,
    } = req.body;
    const imageKeys = ["logo", "loginImage", "favIcon"];

    for (let key of imageKeys) {
      let base64Image = req.body[key];
      if (base64Image) {
        if (!base64Image.startsWith("data:image")) {
          base64Image = `data:image/jpeg;base64,${base64Image}`;
        }
        const url = await commonFunction.getSecureUrl(base64Image, "UIImages");
        req.body[key] = url;
      }
    }
    const result = await createUiDes(req.body);
    return res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UI_CREATE_SUCCES,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getUiDesign = async (req, res, next) => {
  try {
    const result = await findUiDesign({});
    if (!result) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.UI_CREATE_SUCCES,
      });
    }
    return res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
