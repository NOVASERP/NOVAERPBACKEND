const mongoose = require("mongoose");
const genderType = require("../enum/genderType");
const userType = require("../enum/userType");
const statusEnum = require("../enum/status");
const StudentCounter = require("./studentCounterModel");
mongoose.pluralize(null);
const proofSchema = new mongoose.Schema(
  {
    aadharCard: {
      image: { type: String },
      aadharNo: { type: String },
    },
    birthCertificate: { image: { type: String } },
    tc: { image: { type: String } },
  },
  { _id: false }
);
const studentSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    dateOfBirth: String,
    gender: { type: String, enum: Object.values(genderType) },
    phoneNumber: String,
    email: String,
 
    address: {
      homeTown: String,
      city: String,
      state: String,
      pinCode: String,
    },
 
    parentsDetails: {
      fatherName: String,
      motherName: String,
      guardianName: String,
      guardianPhone: String,
      guardianRelationship: String,
    },
    currentClass: {
      class: String,
      classId: { type: mongoose.Types.ObjectId, ref: "Class" },
      section: String,
      rollNumber: String,
      admissionDate: { type: Date, default: Date.now },
    },
    classHistory: [
      {
        class: String,
        classId: { type: mongoose.Types.ObjectId, ref: "Class" },
        section: String,
        rollNumber: String,
        sessionYear: String,
        admissionDate: Date,
      },
    ],
    userType: { type: String, default: userType.STUDENT },
    examResults: [{ type: mongoose.Types.ObjectId, ref: "ExamResult" }],
    status: {
      type: String,
      enum: Object.values(statusEnum),
      default: statusEnum.ACTIVE,
    },
    password: String,
    admissionNumber: { type: String, unique: true },
    addedBy: { type: mongoose.Types.ObjectId, ref: "Staff" },
    studentImage: String,
    bloodGroup: String,
 
    emergencyContact: {
      name: String,
      relationship: String,
      contactNumber: String,
    },
 
    proof: proofSchema,
 
    religion: String,
    casteCategory: String,
    nationality: String,
    languagesKnown: [String],
    disability: { type: Boolean, default: false },
 
    userId: String,
  },
  { timestamps: true }
);
 
studentSchema.pre("save", async function (next) {
  // Only for brand‑new student docs
  if (!this.isNew || this.admissionNumber) return next();
 
  try {
    const year = new Date(this.currentClass.admissionDate).getFullYear();
    const classId = this.currentClass.classId;
    const section = this.currentClass.section;
 
    // Atomically increment & get the next sequence
    const counter = await StudentCounter.findOneAndUpdate(
      { year, classId, section },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
 
    const seq = counter.seq; // 1,2,3…
    const seqPadded = String(seq).padStart(3, "0");
 
    // Build IDs
    this.admissionNumber = `ADM${year}${this.currentClass.class}${section}${seqPadded}`;
   
    this.currentClass.rollNumber = String(seq);
 
    // Mirror into first history entry
    if (Array.isArray(this.classHistory) && this.classHistory[0]) {
      this.classHistory[0].rollNumber = String(seq);
      // this.classHistory[0].sessionYear = String(year);
    }
 
    next();
  } catch (err) {
    next(err);
  }
});
 
module.exports = mongoose.model("students", studentSchema);
 
 