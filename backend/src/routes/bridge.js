const router = require("express").Router();
const controller = require("../apis/bridge/api/bridge");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");

async function listBridges(req, res) {
  try {
    const result = await controller.listBridges(req, res);

    successResponse("List of bridges fetched successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

router.get("/list", isAuthorized, listBridges);

module.exports = router;
