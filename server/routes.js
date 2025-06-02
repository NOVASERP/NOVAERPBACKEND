const studentRoutes = require("./api/v1/controllers/student/studentRoute");
const staffRoutes = require("./api/v1/controllers/admin/staffRoutes");
const userRoutes = require("./api/v1/controllers/userLoginRoutes");

module.exports = function routes(app) {
  app.use("/novaerp/api/v1/student", studentRoutes);
  app.use("/novaerp/api/v1/staff", staffRoutes);
  app.use("/novaerp/api/v1/auth", userRoutes);
};
