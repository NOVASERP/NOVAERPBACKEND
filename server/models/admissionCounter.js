const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const yearGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "Admin",
    },
    academicYear: {
      type: ObjectId,
      ref: "AcademicYear",
    },
  },
  {
    timestamps: true,
  }
);

//model
const YearGroup = mongoose.model("YearGroup", yearGroupSchema);

module.exports = YearGroup;