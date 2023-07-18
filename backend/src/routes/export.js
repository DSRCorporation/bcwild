const router = require("express").Router();
const controller = require("../apis/export/api/export");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");

router.post("/dataExport", isAuthorized, exportData);

async function exportData(req, res) {
  try {
    const result = await controller.exportData(req, res);

    successResponse("Data exported successfully", {}, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

module.exports = router;
