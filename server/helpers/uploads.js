// upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Creates a multer instance for given fields or single
function createUploader({ fields = [], single = null, maxSize = 2 * 1024 * 1024 }) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const dest = 'uploads/';
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    allowed.test(file.mimetype) ? cb(null, true) : cb(new Error('Only JPEG/PNG allowed'));
  };

  const upload = multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter
  });

  if (single) return upload.single(single);
  if (fields.length) return upload.fields(fields);
  return upload.any(); // any file if nothing specified
}

module.exports = createUploader;
