const router = require("express").Router();

const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");
const { imageUploadResult, uploadImages } = require("../helpers/uploadImages");

async function saveImages(req, res) {
  try {
    const result = imageUploadResult(req);
    return successResponse("Images uploaded successfully", result, res);
  } catch (error) {
    return errorResponse(error, res);
  }
}

router.post("/upload", [isAuthorized, uploadImages], saveImages);

module.exports = router;
