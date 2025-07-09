const studentRoutes = require("./api/v1/controllers/student/studentRoute");
const staffRoutes = require("./api/v1/controllers/admin/staffRoutes");
const userRoutes = require("./api/v1/controllers/userLoginRoutes");
const  uiRoutes=require('./api/v1/controllers/uiRoutes');
const noticeRoutes=require('./api/v1/controllers/admin/noticeRoutes');
const classRoutes=require('./api/v1/controllers/admin/classRoutes')
const feeStructureRoutes = require('./api/v1/controllers/FeeStructure/feeStructureRoutes');
const feePaymentRoutes = require('./api/v1/controllers/FeeStructure/feePaymentRoutes');
const subjectRoutes = require('./api/v1/controllers/subject/subjectRoutes');
const holidayRoutes = require('./api/v1/controllers/holiday/holidayRoutes');
const inquiryRoutes = require('./api/v1/controllers/inquires/inquiryRoutes');
const attendanceRoutes = require('./api/v1/controllers/attendance/attendance');


module.exports = function routes(app) {
  app.use("/novaerp/api/v1/student", studentRoutes);
  app.use("/novaerp/api/v1/staff", staffRoutes);
  app.use("/novaerp/api/v1/auth", userRoutes);
  app.use("/novaerp/api/v1/ui", uiRoutes);
  app.use("/novaerp/api/v1/notice", noticeRoutes);
   app.use("/novaerp/api/v1/class", classRoutes);
  app.use("/novaerp/api/v1/fee-structure", feeStructureRoutes);
   app.use("/novaerp/api/v1/fee-payment", feePaymentRoutes);
   app.use("/novaerp/api/v1/subject", subjectRoutes);
   app.use('/novaerp/api/v1/holiday', holidayRoutes);
   app.use('/novaerp/api/v1/inquiry', inquiryRoutes);
   app.use("/novaerp/api/v1/user", userRoutes);
  app.use('/novaerp/api/v1/attendance', attendanceRoutes);
};
