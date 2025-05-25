const studentRoutes=require("./api/v1/controllers/student/studentRoute");


module.exports=function routes(app) {
    app.use('/novaerp/api/v1/student', studentRoutes);
}