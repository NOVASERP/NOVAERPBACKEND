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
  findStudentPop,
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
const { classServices } = require("../../services/classServices");
const {
  createClass,
  findClass,
  findClassData,
  deleteClass,
  updateClass,
  countTotalClass,
} = classServices;
const defPass = process.env.DEFAULT_PASSWORD;
/* Small helper: safe path getter for Multer arrays -------------------- */
const pathIfPresent = (aadharNofiles, key) =>
  Array.isArray(aadharNofiles[key]) &&
  aadharNofiles[key][0] &&
  aadharNofiles[key][0].path;
 
// exports.studentCreation = async (req, res, next) => {
//   try {
//     let { data } = req.body;
//     let requestData =
//       typeof req.body.data === "string"
//         ? JSON.parse(req.body.data)
//         : req.body.data;
//     const files = req.files || req.file;
//     const proof = {};
//     let studentImageLocalPath = null;
 
//     console.log("requestData========", requestData);
 
//     ["aadharCard", "birthCertificate", "tc"].forEach((key) => {
//       const arr = files[key];
//       if (Array.isArray(arr) && arr[0]) proof[key] = arr[0].path;
//     });
 
//     if (Array.isArray(files.studentImage) && files.studentImage[0]) {
//       studentImageLocalPath = files.studentImage[0].path;
//     }
 
//     if (Object.keys(proof).length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one proof image is required." });
//     }
 
//     requestData.proof = proof;
//     if (studentImageLocalPath) requestData.studentImage = studentImageLocalPath;
 
//     const hashedPassword = bcrypt.hashSync(defPass, 10);
//     requestData.password = hashedPassword;
 
//     const admissionDateStr = new Date(requestData?.classHistory[0]?.admissionDate);
//     const year = admissionDateStr.getFullYear();
//     const count = await countTotalStudent({});
//     console.log("count===", count);
 
//     const paddedCount = String(count + 1).padStart(2, "0");
//     console.log("paddedCount===", paddedCount);
//     console.log(" `ADM${year}${paddedCount}`==", `ADM${year}${paddedCount}`);
 
//     requestData.admissionNumber = `ADM${year}${paddedCount}`;
 
//     const totalUsers = await countTotalUser();
//     requestData.userId = `nova${String(totalUsers + 1).padStart(6, "0")}`;
 
//     for (const key of Object.keys(proof)) {
//       const url = await commonFunction.getSecureUrl(
//         proof[key],
//         "studentProofs"
//       );
//       requestData.proof[key] = { image: url };
//     }
 
//     if (studentImageLocalPath) {
//       const imgUrl = await commonFunction.getSecureUrl(
//         studentImageLocalPath,
//         "studentImage"
//       );
//       requestData.studentImage = imgUrl;
//     }
//     const classDetails = await findClass({
//       _id: requestData.currentClass.class,
//     });
//     console.log("classDetails==", classDetails);
 
//     const object = {
//       firstName: requestData.firstName,
//       middleName: requestData.middleName,
//       lastName: requestData.lastName,
//       dateOfBirth: requestData.dateOfBirth,
//       gender: requestData.gender,
//       phoneNumber: requestData.phoneNumber,
//       email: requestData.email,
//       studentImage:requestData.studentImage,
//       address: {
//         homeTown: requestData.homeTown,
//         city: requestData.city,
//         state: requestData.state,
//         pinCode: requestData.pinCode,
//       },
//       parentsDetails: {
//         fatherName: requestData.fatherName,
//         motherName: requestData.motherName,
//         guardianName: requestData.guardianName,
//         guardianPhone: requestData.guardianPhone,
//         guardianRelationship: requestData.guardianRelationship,
//       },
//       currentClass: {
//         classId: requestData.currentClass.class,
//         class: classDetails.class,
//         section: requestData.currentClass.section,
//         rollNumber: requestData.currentClass.rollNumber,
//         admissionDate: requestData.classHistory[0].admissionDate,
//       },
//       classHistory: [
//         {
//           classId: requestData.currentClass.class,
//           class: classDetails.class,
//           section: requestData.currentClass.section,
//           rollNumber: requestData.currentClass.rollNumber,
//           sessionYear: { type: String },
//           admissionDate: requestData.classHistory[0].admissionDate,
//         },
//       ],
//       addedBy: requestData.addedBy,
//       bloodGroup: requestData.bloodGroup,
//       emergencyContact: { name: requestData.name, relationship: requestData.relationship, contactNumber: requestData.contactNumber },
//       proof: {
//         aadharCard: { aadharNo:  requestData.aadharNo },
//         birthCertificate: {},
//         tc: {},
//       },
//       religion: requestData.addedBy,
//       casteCategory: requestData.addedBy,
//       nationality: requestData.addedBy,
//       languagesKnown: requestData.languagesKnown,
//       disability: requestData.disability,
//     };
 
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
//       result,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };
 
// controllers/student.controller.js
 
 
 
exports.studentCreation = async (req, res, next) => {
  try {
    const body =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data || {};
 
    const files = req.files || {};
    const proof = {};
    for (const key of ["aadharCard", "birthCertificate", "tc"]) {
      const local = pathIfPresent(files, key);
      if (!local) continue;
      proof[key] = {
        image: await commonFunction.getSecureUrl(local, "studentProofs"),
      };
    }
    if (!Object.keys(proof).length) {
      return res
        .status(400)
        .json({ message: "At least one proof document is required." });
    }
    if (body.proof.aadharCard.aadharNo) {
      if (!proof.aadharCard) proof.aadharCard = {};
      proof.aadharCard.aadharNo = body?.proof?.aadharCard?.aadharNo;
    }
   
    let studentImageUrl;
    const imgLocal = pathIfPresent(files, "studentImage");
    if (imgLocal) {
      studentImageUrl = await commonFunction.getSecureUrl(
        imgLocal,
        "studentImage"
      );
    }
    const classDoc = await findClass({ _id: body.currentClass.class });
    const admissionDate = body.classHistory[0].admissionDate
      ? new Date(body.classHistory[0].admissionDate)
      : new Date();
 
    const classObj = {
      classId: body.currentClass.class,
      class: classDoc.class,
      section: body.currentClass.section,
      admissionDate,
    };
    const totalUsers = await countTotalUser();
    const startYear = admissionDate.getFullYear();
    console.log("startYear===",startYear);
    const makesession=`${startYear}-${startYear + 1}`
    const studentData = {
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      email: body.email,
      address: body.address,
      parentsDetails: body.parentsDetails,
      currentClass: { ...classObj },
      classHistory: [
        {
          ...classObj,
          sessionYear: makesession,
        },
      ],
      proof,
      studentImage: studentImageUrl,
      bloodGroup: body.bloodGroup,
      emergencyContact: {
        name: body.emergencyContact.name,
        relationship: body.emergencyContact.relationship,
        contactNumber: body.emergencyContact.contactNumber,
      },
      religion: body.religion,
      casteCategory: body.casteCategory,
      nationality: body.nationality,
      languagesKnown: body.languagesKnown,
      disability: body.disability,
      addedBy: body.addedBy,
      password: bcrypt.hashSync(defPass, 10),
      userId: `nova${String(totalUsers + 1).padStart(6, "0")}`,
    };
console.log("studentData===",studentData,"${startYear}-${startYear + 1}",`${startYear}-${startYear + 1}`);
 
    const newStudent = await createStudent(studentData);
console.log("newStudent===",newStudent);
 
    await createUser({
      userId: studentData.userId,
      password: studentData.password,
      effDate: admissionDate,
      role: userType.STUDENT,
      newUserCount: totalUsers + 1,
    });
    return res.status(statusCode.OK).json({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.STUDENT_ADDED,
      result: newStudent,
    });
  } catch (err) {
    next(err);
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
    const { studentdId } = req.body;
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
 
exports.getStudentById = async (req, res, next) => {
  try {
    const result = await findStudentPop({ _id: req.params.studentId });
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
 
 