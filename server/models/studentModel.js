const mongoose = require("mongoose");
const genderType = require("../enum/genderType");
const userType = require("../enum/userType");
const status = require("../enum/status");
mongoose.pluralize(null);

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: [genderType.FEMALE, genderType.MALE, genderType.OTHER],
    },
    aadharNumber: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    parentsDetails: {
      fatherName: { type: String },
      motherName: { type: String },
      guardianName: { type: String },
      guardianPhone: { type: String },
      guardianRelationship: { type: String },
    },
    classes: [
      {
        class: { type: String },
        section: { type: String },
        rollNumber: { type: String },
        admissionDate: { type: String },
        sessionYear: { type: String },
      },
    ],
    userType: { type: String, default: userType.STUDENT },
    examResults: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ExamResult",
      },
    ],
    status: { type: String, default: status.ACTIVE },
    password:{type:String,default:"nova1234"},
    admissionNumber: { type: String },

  },
  { timestamps: true }
);

module.exports = mongoose.model("students", studentSchema);
