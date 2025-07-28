const express = require('express');
const router = express.Router();
const Attendance = require('../../../../models/Attendance');
const Users = require('../../../../models/userModel'); // Corrected path based on your previous messages

// Helper function to format date as YYYY-MM-DD (with leading zeros)
// This ensures consistency with how you expect dates to be stored as keys.
const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


// --- API: Mark Attendance ---
router.post('/mark', async (req, res) => {
    try {
        const { qrcode_id, sessionYear } = req.body; // Destructure sessionYear as well

        if (!qrcode_id) {
            return res.status(400).json({ message: 'QR code is required' });
        }

        // Find user by QR code (assuming qrcode_id is the user's _id or a specific QR code field)
        // If qrcode_id is directly the user's _id, this is correct.
        // If it's a separate field, change findOne({ _id }) to findOne({ qrCode: qrcode_id })
        const user = await Users.findOne({ _id: qrcode_id }); // Corrected: use _id: qrcode_id

        console.log("User found:", user, "QR ID used:", qrcode_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const todayDate = formatDateKey(new Date('2025-07-27T12:00:00Z')); // Use the consistent helper function

        // Check if attendance record exists for this user
        let record = await Attendance.findOne({ userId: user._id });

        // If not found, create a new one
        if (!record) {
            record = new Attendance({
                userId: user._id,
                attendanceRecords: new Map() // Initialize as a new Map
            });
        }

        // Check if today's attendance already marked
        // Use .has() for Map, or check directly for plain objects
        if (record.attendanceRecords.has(todayDate)) {
            return res.status(200).json({ message: 'Attendance already marked for today' });
        }

        // Mark attendance
        // --- CRITICAL FIX HERE: Ensure 'P' is saved without spaces ---
        // Also, use user.qrCode if available, otherwise consider where it should come from
        record.attendanceRecords.set(todayDate, {
            sessionYear: sessionYear || 'N/A', // Use provided sessionYear or default
            status: 'P', // Save as 'P' directly, without extra spaces
            qrCode: user.qrCode || qrcode_id // Use user's qrCode from their document, or the incoming qrcode_id if user.qrCode is missing
        });

        await record.save();

        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Server error: ' + error.message }); // Include error message for debugging
    }
});


// --- API: Last Seven Days Attendance for Admin Dashboard ---
router.get('/admin/last7days-summary', async (req, res) => {
    try {
        const today = new Date(); // Current date
        const dateRange = [];

        // Generate the last 7 dates in YYYY-MM-DD format, in chronological order
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dateRange.unshift(formatDateKey(date)); // Use the helper function for consistent formatting
        }

        console.log("Generated dateRange (for lookup):", dateRange);

        // Fetch all users to categorize by role (teacher/student)
        const allUsers = await Users.find({}, '_id role');
        const teachers = allUsers.filter(user => user.role === 'TEACHER');
        const students = allUsers.filter(user => user.role === 'STUDENT');

        console.log(`Total Teachers: ${teachers.length}, Total Students: ${students.length}`);

        // Fetch all attendance records for all users
        const allAttendanceRecords = await Attendance.find({}, 'userId attendanceRecords');

        console.log(`Fetched ${allAttendanceRecords.length} total attendance records.`);

        // Initialize the summary data structure for each of the 7 days
        const attendanceSummary = dateRange.map(date => ({
            date: date,
            teachersPresent: 0,
            studentsPresent: 0,
            totalTeachers: teachers.length,
            totalStudents: students.length
        }));

        // Iterate through each attendance record fetched from the database
        for (const record of allAttendanceRecords) {
            const userId = record.userId.toString();
            const user = allUsers.find(u => u._id.toString() === userId);

            if (!user) {
                console.warn(`User with ID ${userId} not found for an attendance record. Skipping this attendance record.`);
                continue;
            }

            // Iterate through the last 7 days to check attendance for the current user
            for (const dateToLookFor of dateRange) {
                // Access attendance details for the specific date from the attendanceRecords Map/Object
                const attendanceDetails = record.attendanceRecords ? record.attendanceRecords.get(dateToLookFor) : undefined;

                console.log(
                    `Checking User: ${user.role} (${userId}), Date: ${dateToLookFor}, ` +
                    `Attendance Details Found: ${attendanceDetails ? 'YES' : 'NO'}, ` +
                    `Status in DB (raw): '${attendanceDetails ? attendanceDetails.status : 'N/A'}'`
                );

                // --- CRITICAL FIX APPLIED HERE: Trim whitespace from the status string before comparison ---
                if (attendanceDetails && attendanceDetails.status && attendanceDetails.status.trim() === 'P') {
                    const daySummary = attendanceSummary.find(s => s.date === dateToLookFor);

                    if (daySummary) {
                        if (user.role === 'TEACHER') {
                            daySummary.teachersPresent++;
                        } else if (user.role === 'STUDENT') {
                            daySummary.studentsPresent++;
                        }
                    }
                }
            }
        }

        // Send the aggregated attendance data as the API response
        res.status(200).json({
            message: 'Last 7 days attendance summary for admin dashboard fetched successfully',
            attendanceData: attendanceSummary
        });

    } catch (error) {
        console.error('Error fetching admin dashboard attendance summary:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;