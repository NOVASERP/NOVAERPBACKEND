const mongoose = require("mongoose");
const roleType = require("../enum/userType");
mongoose.pluralize('null');
const status = require("../enum/status");



const userSchema=new mongoose.Schema({
    userId:{type:String},
    effDate:{type:String},
    role:{type:String,enum:[roleType.ADMIN,roleType.NON_TEACHING,roleType.PARENTS,roleType.STUDENT,roleType.SUBADMIN,roleType.TEACHER]},
    userCount:{type:Number},
    status: { type: String,enum: Object.values(status), default: status.ACTIVE },
})

module.exports = mongoose.model("users", userSchema);
