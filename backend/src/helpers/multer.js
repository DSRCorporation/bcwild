const multer = require("multer");

// const maxSize = 1 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  // limits: { fileSize: maxSize }
}).single("image");

module.exports = upload;
