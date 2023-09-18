const router = require("express").Router();

const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");
const { singleImageUploadResult } = require("../helpers/uploadImages");
const {
  uploadProfileImage,
  profileImageForUsername,
} = require("../helpers/uploadProfileImage");

async function saveImage(req, res) {
  try {
    const result = singleImageUploadResult(req);
    return successResponse("Images uploaded successfully", result, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving profile image", error);
    return errorResponse(error, res);
  }
}

async function serveImage(req, res) {
  try {
    const { username } = req.decoded;
    const imagePath = profileImageForUsername(username);
    return res.sendFile(imagePath);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("serveimage error", error);
    return errorResponse(error, res);
  }
}

router.post("/", [isAuthorized, uploadProfileImage], saveImage);
router.get("/", [isAuthorized], serveImage);

module.exports = router;
