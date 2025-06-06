const mongoose = require("mongoose");
const userType = require("../enum/userType"); // STUDENT, TEACHER, PARENT, ALL
const status = require("../enum/status");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    attachmentUrl: { type: String }, 
    publishedBy: {type:mongoose.Types.ObjectId,ref:'Staff'},
    targetRoles: [{ type: String, enum: Object.values(userType) }],
    visibleFrom: { type: Date, required: true },
    visibleTill: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: Object.values(status),default: status.ACTIVE },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notices", noticeSchema);
