const mongoose = require("mongoose");
const generateQrCodeString = require("../utils/generateQrCodeString");

const MONGO_URI = "mongodb+srv://nodejscharu076:Charu%404699@novaerp.d8zjulu.mongodb.net/?retryWrites=true&w=majority&appName=NovaERP"; // replace if needed

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const User = mongoose.connection.collection("users"); // direct collection access

    const users = await User.find({}).toArray();

    for (const user of users) {
      // Skip if already has qrCode
      if (user.qrCode) continue;

      const qrCode = generateQrCodeString(user._id);
      await User.updateOne(
        { _id: user._id },
        { $set: { qrCode } }
      );

      console.log(`✅ QR Code set for userId: ${user.userId}`);
    }

    console.log("🎉 QR generation done for all users");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};


run();
