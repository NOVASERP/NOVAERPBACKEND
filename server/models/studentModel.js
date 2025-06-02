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
    phoneNumber: { type: String },
    email: { type: String },
    address: {
      homeTown: { type: String },
      city: { type: String },
      state: { type: String },
      pinCode: { type: String },
    },
    parentsDetails: {
      fatherName: { type: String },
      motherName: { type: String },
      guardianName: { type: String },
      guardianPhone: { type: String },
      guardianRelationship: { type: String },
    },
    currentClass: {
      class: { type: mongoose.Types.ObjectId, ref: "Class" },
      section: { type: String },
      rollNumber: { type: String },
    },
    classHistory: [
      {
        class: { type: mongoose.Types.ObjectId, ref: "Class" },
        section: { type: String },
        rollNumber: { type: String },
        sessionYear: { type: String },
        admissionDate: { type: Date },
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
    password: { type: String, default: "nova1234" },
    admissionNumber: { type: String, unique: true },
    addedBy: { type: mongoose.Types.ObjectId, ref: "Staff" },
    studentImage: { type: String },
    bloodGroup: { type: String },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      contactNumber: { type: String },
    },
    proof: {
      aadharCard: { image: { type: String }, aadharNo: { type: String } },
      birthCertificate: { image: { type: String } },
      tc: { image: { type: String } },
    },
    religion: { type: String },
    casteCategory: { type: String }, // e.g., General, OBC, SC, ST
    nationality: { type: String },
    languagesKnown: [{ type: String }],
    disability: { type: Boolean, default: false },
    userId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("students", studentSchema);
