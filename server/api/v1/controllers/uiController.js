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
    const {
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
    const images=[logo,loginImage,favIcon]
    for (var i = 0; i < images.length; i++) {
        console.log("images=====",images);
        
        console.log("i===========",i);
      const imageUrl = await commonFunction(images[i]);
      console.log("images[i]====",images[i]);
      
      req.body.images[i] =imageUrl;
    }

    const result = await createUiDes(req.body);
    return res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UI_CREATE_SUCCES,
      result: result,
    });
  } catch (error) {}
};
