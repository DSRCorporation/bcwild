const router = require("express").Router();
const controller = require("../apis/sync/api/sync");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");

async function pushChanges(req, res) {
  try {
    await controller.pushChanges(req, res);

    successResponse("Pushed changes successfully", {}, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

// async function pullChanges(req, res) {
//   try {
//     const result = await controller.pullChanges(req, res);
//
//     successResponse("Pulled changes successfully", result, res);
//   } catch (error) {
//     errorResponse(error, res);
//   }
// }

router.post("/pushChanges", isAuthorized, pushChanges);
// router.get('/pullChanges',isAuthorized,pullChanges)

module.exports = router;
