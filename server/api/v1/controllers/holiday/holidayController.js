const Holiday = require('../../../../models/HolidaySchema');

// Create Holiday
exports.createHoliday = async (req, res) => {
  try {
    const holiday = new Holiday(req.body);
    await holiday.save();
    res.status(201).json({ success: true, data: holiday });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all holidays (optional filter by academicYear)
exports.getHolidays = async (req, res) => {
  try {
    const filter = {};
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;

    const holidays = await Holiday.find(filter).sort({ date: 1 });
    res.status(200).json({ success: true, data: holidays });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete holiday
exports.deleteHoliday = async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Holiday deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
