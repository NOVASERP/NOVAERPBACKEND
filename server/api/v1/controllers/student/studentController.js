const responseMessage = require("../../../../../assets/responseMessage");
const statusCode = require("../../../../../assets/responceCode");
const statusType = require("../../../../enum/status");
const userType = require("../../../../enum/userType");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const commonFunction = require("../../../../helpers/utils");
const { studentServices } = require("../../services/studentServices");
const status = require("../../../../enum/status");
const {
  createStudent,
  findStudent,
  findStudentData,
  deleteStudent,
  updateStudent,
  countTotalStudent,
  findStudentPop
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
const defPass = process.env.DEFAULT_PASSWORD;
// exports.studentCreation1 = async (req, res, next) => {
//   try {
//     let { data } = req.body;
//     const requestData = data;
//     // const requestData = JSON.parse(data);
//     console.log("requestData==", requestData);
//     const files = req.files || {};
//     // E.g.: req.files['aadharCard'] = [ fileObj ]
//     const proof = {};

//     ["aadharCard", "birthCertificate", "tc", "studentImage"].forEach((key) => {
//       const arr = files[key];
//       if (Array.isArray(arr) && arr[0]) {
//         proof[key] = arr[0].path; // or URL after uploading to cloud
//       }
//     });

//     // Check that at least one image is uploaded
//     if (Object.keys(proof).length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one proof image is required." });
//     }
//     const hashedPassword = bcrypt.hashSync(defPass, 10);
//     const admissionDateStr = new Date(requestData?.classes?.[0]?.admissionDate);
//     const year = admissionDateStr.getFullYear();
//     const count = await countTotalStudent({
//       "classes.admissionDate": { $gte: `01-01-${year}`, $lte: `31-12-${year}` },
//     });
//     const paddedCount = String(count + 1).padStart(2, "0");
//     requestData.admissionNumber = `ADM${year}${requestData.currentClass.section}${requestData.currentClass.rollNumber}${paddedCount}`;

//     const totalUsers = await countTotalUser();
//     requestData.userId = `nova${String(totalUsers + 1).padStart(6, "0")}`;

//     requestData.password = hashedPassword;
//     const base64Aadhar = requestData?.proof?.aadharCard?.image;
//     const base64Birth = requestData?.proof?.birthCertificate?.image;
//     const base64TC = requestData?.proof?.tc?.image;

//     if (requestData.studentImage) {
//       const imgurl = await commonFunction.getSecureUrl(
//         requestData.studentImage,
//         "studentProof"
//       );
//       console.log("imgurl==", imgurl);

//       requestData.studentImage = imgurl;
//     }
//     if (base64Aadhar) {
//       const imgurl = await commonFunction.getSecureUrl(
//         base64Aadhar,
//         "studentProof"
//       );
//       console.log("adhar", imgurl);

//       requestData.proof.aadharCard.image = imgurl;
//     }
//     if (base64Birth) {
//       const imgurl = await commonFunction.getSecureUrl(
//         base64Birth,
//         "studentProof"
//       );
//       console.log("birth==", imgurl);

//       requestData.proof.birthCertificate.image = imgurl;
//     }
//     if (base64TC) {
//       const imgurl = await commonFunction.getSecureUrl(
//         base64TC,
//         "studentProof"
//       );

//       requestData.proof.tc.image = imgurl;
//     }
//     console.log(requestData.proof, "=========");

//     console.log(JSON.stringify(requestData.proof, null, 2));
//     const result = await createStudent(requestData);
//     await createUser({
//       userId: requestData.userId,
//       password: hashedPassword,
//       effDate: requestData.admissionDate,
//       role: userType.STUDENT,
//       newUserCount: totalUsers + 1,
//     });
//     return res.status(statusCode.OK).send({
//       statusCode: statusCode.OK,
//       responseMessage: responseMessage.STUDENT_ADDED,
//       result: result,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };
exports.studentCreation = async (req, res, next) => {
  try {
    let { data } = req.body;
    let requestData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
    const files = req.files || req.file;
    const proof = {};

    ["aadharCard", "birthCertificate", "tc", "studentImage"].forEach((key) => {
      const arr = files[key];
      if (Array.isArray(arr) && arr[0]) {
        proof[key] = arr[0].path;
      }
    });

    if (Object.keys(proof).length === 0) {
      return res
        .status(400)
        .json({ message: "At least one proof image is required." });
    }

    requestData.proof = proof;

    const hashedPassword = bcrypt.hashSync(defPass, 10);
    requestData.password = hashedPassword;

    const admissionDateStr = new Date(requestData?.currentClass?.admissionDate);
    const year = admissionDateStr.getFullYear();
    const count = await countTotalStudent({
      "classHistory.admissionDate": {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    });

    const paddedCount = String(count + 1).padStart(2, "0");
    requestData.admissionNumber = `ADM${year}${paddedCount}`;

    const totalUsers = await countTotalUser();
    requestData.userId = `nova${String(totalUsers + 1).padStart(6, "0")}`;

    for (const key of Object.keys(proof)) {
      const url = await commonFunction.getSecureUrl(
        proof[key],
        "studentProofs"
      );
      requestData.proof[key] = { image: url };
    }

    const result = await createStudent(requestData);
    await createUser({
      userId: requestData.userId,
      password: hashedPassword,
      effDate: requestData.admissionDate,
      role: userType.STUDENT,
      newUserCount: totalUsers + 1,
    });

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.STUDENT_ADDED,
      result,
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

exports.editStudentDetails = async (req, res, next) => {
  try {
    const {studentdId} = req.body;
    // const isAdminExist = await a();
    // if (!isAdminExist) {
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.badRequest,
    //     responseMessage: responseMessage.UNAUTHORIZED,
    //   });
    // }
    const obj = {};
    const updateProfile = await updateStudent({ _id: studentdId }, { obj });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: updateProfile,
    });
  } catch (error) {
    console.log("Error while trying to edit profile", error);
    return next(error);
  }
};

exports.deleteSTudents = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.getStudentById=async(req,res,next)=>{
  try {
    const result=await findStudentPop({_id:req.params.studentId});
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
}