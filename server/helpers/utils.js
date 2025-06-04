const jwt = require("jsonwebtoken");
const cloudinary = require ("cloudinary");
const qrcode = require ("qrcode");
const envURL="CLOUDINARY_URL=cloudinary://762768618877418:bifc8xU3WVckZWcKPwMRKehQnaA@dxvwvoj0y"
cloudinary.config({
  cloud_name: "dxvwvoj0y",
  api_key: "762768618877418",
  api_secret: "-bifc8xU3WVckZWcKPwMRKehQnaA",
});


module.exports = {
  getToken: async (payload) => {
    try {
      const token = jwt.sign(payload, "charu", { expiresIn: "24" });
      return token;
    } catch (error) {
      return error;
    }
  },
  formatDate: async (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  },
  base64encoded: async (data) => {
    try {
      return await qrcode.toDataURL(data);
    } catch (error) {
      return error;
    }
  },
  getSecureUrl: async (base64) => {
    try {
      const data = await cloudinary.v2.uploader.upload(base64);
      return data.secure_url;
    } catch (error) {
      return error;
    }
  },
};
