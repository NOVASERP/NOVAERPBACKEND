const mongoose = require("mongoose");
const roleType = require("../enum/userType");
const status = require("../enum/status");
mongoose.pluralize(null);

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: String,
    role: {
      type: { type: String },
      enum: [roleType.ADMIN, roleType.TEACHER, roleType.NON_TEACHING],
    },
    // associatedId: mongoose.Schema.Types.ObjectId,

    subject: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Subjects",
      },
    ],
    studyClass: [
      {
        class: { type: String },
        subject: { type: String },
      },
    ],
    department: { type: String },
    designation: { type: String },
    dateEmployed: { type: Date, default: Date.now },
    emplId: { type: String },
    status: {
      type: String,
      enum: [
        status.ACTIVE,
        status.ALUMINI,
        status.BLOCK,
        status.DELETE,
        status.SUSPEND,
      ],
      default: status.ACTIVE,
    },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      contactNumber: { type: String },
    },
    addedBy: { type: mongoose.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", userSchema);
