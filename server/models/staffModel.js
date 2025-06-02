const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const roleType = require("../enum/userType");
const status = require("../enum/status");
const gender = require("../enum/genderType");
const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
const password = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";
const { userServices } = require("../api/v1/services/userServices");
const {
  createUser,
  countTotalUser,
} = userServices;
const commonFunction=require("../helpers/utils")
mongoose.pluralize(null);

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: [roleType.ADMIN, roleType.TEACHER, roleType.NON_TEACHING],
      required: true,
    },
    gender: { type: String, enum: [gender.FEMALE, gender.MALE, gender.OTHER] },
    dob: { type: Date },

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    department: { type: String },
    designation: { type: String },
    qualification: { type: String },
    experience: { type: Number }, // in years
    previousEmployer: { type: String },

    dateEmployed: { type: Date, default: Date.now },
    emplId: { type: String },

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

    isClassTeacher: { type: Boolean, default: false },
    isHOD: { type: Boolean, default: false },

    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      contactNumber: { type: String },
    },

    documents: [
      {
        name: { type: String }, // e.g. "Resume", "ID Proof"
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    addedBy: { type: mongoose.Types.ObjectId, ref: "Staff" },

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

    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    passwordExpires: { type: Date },
    userId: { type: String },
  },
  { timestamps: true }
);
const Staff = mongoose.model("Staff", staffSchema);
// Create default admin after model is defined
(async () => {
  try {
    const exists = await Staff.findOne({ role: roleType.ADMIN });
      const totalUsers = await countTotalUser();
      const newUserCount = totalUsers + 1;
      const paddedUserCount = String(newUserCount).padStart(6, "0");
      let userId = `nova${paddedUserCount}`;
      const addedDate=await commonFunction.formatDate(new Date())
    if (!exists) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Staff.create({
        name: "Super Admin",
        email,
        password: hashedPassword,
        role: roleType.ADMIN,
        emplId: "ADMIN001",
        isVerified: true,
        userId: userId,
      });
      await createUser({
        userId: userId,
        effDate: addedDate,
        role: roleType.ADMIN,
        newUserCount,
      });
      console.log("🎉 Default Admin created:", email);
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Failed to create default admin:", err.message);
  }
})();

module.exports = Staff;
