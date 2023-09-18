const multer = require("multer");
const fs = require("fs");

// Form data key to append image to
const formDataKey = "image";

// Directory where images are saved under random names
const imageDir = "uploads/profileImages";

// The data returned by the endpoint has the array property `files`.  It
// consists of objects with the following properties copied from respective
// multer's properties.
const multerPropertiesToCopy = [
  "originalname",
  "encoding",
  "mimetype",
  "filename",
  "size",
];

const ensureImageDir = () => {
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: imageDir,
  filename: (req, file, cb) => {
    ensureImageDir();
    const { username } = req.decoded;
    cb(null, username);
  },
});

const multerUpload = multer({ storage });

const uploadProfileImage = multerUpload.single(formDataKey);

const profileImageForUsername = (username) => `${process.cwd()}/${imageDir}/${username}`;

module.exports = {
  uploadProfileImage,
  profileImageForUsername,
};
