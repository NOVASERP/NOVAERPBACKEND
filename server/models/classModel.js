const mongoose = require("mongoose");
mongoose.pluralize(null);
const classSchema = new mongoose.Schema(
  {
    class: String,
    section:  {
      type: String,
    },
    academicYear: { type: String },
    // classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    gradeLevel: {
      type: String, // e.g., "Primary", "Secondary", "Higher Secondary"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
