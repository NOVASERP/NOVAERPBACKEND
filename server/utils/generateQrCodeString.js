const crypto = require("crypto");

const generateQrCodeString = (id) => {
  return crypto.createHash("sha256").update(id.toString()).digest("hex");
};

module.exports = generateQrCodeString;
