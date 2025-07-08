const Subject = require('../../../../models/Subject');

// Create Subject
exports.createSubject = async (req, res) => {
  try {
    const { name, code, description, class: className } = req.body;
    const newSubject = new Subject({ name, code, description, class: className });
    await newSubject.save();
    res.status(201).json({ success: true, data: newSubject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Subject
exports.updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Subject not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
