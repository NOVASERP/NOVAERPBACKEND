const studentRoutes = require("./api/v1/controllers/student/studentRoute");
const staffRoutes = require("./api/v1/controllers/admin/staffRoutes");
const userRoutes = require("./api/v1/controllers/userLoginRoutes");
const  uiRoutes=require('./api/v1/controllers/uiRoutes');
const noticeRoutes=require('./api/v1/controllers/admin/noticeRoutes');
const classRoutes=require('./api/v1/controllers/admin/classRoutes')
const feeStructureRoutes = require('./api/v1/controllers/admin/feeStructureRoutes');

module.exports = function routes(app) {
  app.use("/novaerp/api/v1/student", studentRoutes);
  app.use("/novaerp/api/v1/staff", staffRoutes);
  app.use("/novaerp/api/v1/auth", userRoutes);
  app.use("/novaerp/api/v1/ui", uiRoutes);
  app.use("/novaerp/api/v1/notice", noticeRoutes);
   app.use("/novaerp/api/v1/class", classRoutes);
  app.use("/novaerp/api/v1/fee-structure", feeStructureRoutes);
};
