const mongoose = require("mongoose");
mongoose.pluralize(null);
const classSchema = new mongoose.Schema(
  {
    class: String,
    section: String,
    academicYear: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear" },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    section: {
      type: String,
    },
    gradeLevel: {
      type: String, // e.g., "Primary", "Secondary", "Higher Secondary"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
