const multer = require("multer");
const crypto = require("crypto");

// Form data key to append image to
const formDataKey = "image";

// Directory where images are saved under random names
const imageDir = "uploads/images/";

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

// Adapted from multer's source
const randomString = (cb) =>
  crypto.randomBytes(16, (err, raw) => {
    cb(err, err ? undefined : raw.toString("hex"));
  });

const multerFileToFileResult = (file) => {
  const fileResult = {};
  multerPropertiesToCopy.forEach((property) => {
    fileResult[property] = file[property];
  });
  return fileResult;
};

const imageUploadResult = (req) => {
  const { files } = req;
  return { files: files.map(multerFileToFileResult) };
};

const storage = multer.diskStorage({
  destination: imageDir,
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/").pop();
    randomString((err, name) => (err ? cb(err) : cb(null, `${name}.${ext}`)));
  },
});

const multerUpload = multer({ storage });

const uploadImages = multerUpload.array(formDataKey);

module.exports = {
  imageUploadResult,
  uploadImages,
};
