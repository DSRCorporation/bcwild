const router = require("express").Router();
const controller = require("../apis/export/api/export");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");

async function exportData(req, res) {
  try {
    await controller.exportData(req, res);

    successResponse("Data exported successfully", {}, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

router.post("/dataExport", isAuthorized, exportData);

module.exports = router;
