const Users = require("../../../../models/userModel");
const Students = require("../../../../models/studentModel");
const Staff = require("../../../../models/staffModel");

exports.getAllUsersWithDetails = async (req, res, next) => {
  try {
    const users = await Users.find({});

    const fullUsers = await Promise.all(
      users.map(async (user) => {
        let mergedData = {
          _id: user._id,
          userId: user.userId,
          role: user.role,
        };

        console.log("🔍 User:", user.userId, "| Role:", user.userId + user.role);

        if (user.role === "STUDENT") {
          const student = await Students.findOne({ userId: user.userId });

          if (student) {
            // Combine student full name
            mergedData.name = `${student.firstName || ""} ${student.middleName || ""} ${student.lastName || ""}`.trim();
            mergedData.photo = student.studentImage || null;

            // Class info
            if (student.currentClass?.class && student.currentClass?.section) {
              mergedData.className = `${student.currentClass.class}-${student.currentClass.section}`;
            } else {
              mergedData.className = "N/A";
            }

            // Session info
            if (student.classHistory && student.classHistory.length > 0) {
              const latestClassHistory = student.classHistory[student.classHistory.length - 1];
              mergedData.sessionYear = latestClassHistory.sessionYear || "N/A";

              // QR Code generation
            //   mergedData.qrCode = `${student._id || 'N/A'} - ${user.role || 'N/A'} - ${latestClassHistory.sessionYear || 'N/A'}`;
            mergedData.qrCode = `${student._id || 'N/A'}`;
        } else {
              mergedData.sessionYear = "N/A";
              mergedData.qrCode = `${student._id || 'N/A'}` ;
            }

            mergedData.user_idforrefreance = student._id;
          }

        } else {
          // Staff
          const staff = await Staff.findOne({ userId: user.userId });
          if (staff) {
            mergedData.name = staff.name || "N/A";
            mergedData.photo = staff.profilePic || null;

            // SessionYear may not apply to staff
            mergedData.sessionYear = "N/A";

            // mergedData.qrCode = `${staff._id || 'N/A'} - ${user.role || 'N/A'}`;
            mergedData.qrCode = `${staff._id || 'N/A'}` ;
            mergedData.user_idforrefreance = staff._id;
          }
        }

        return mergedData;
      })
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Users with details fetched successfully",
      result: fullUsers,
    });
  } catch (error) {
    console.error("❌ Error fetching users with details:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
