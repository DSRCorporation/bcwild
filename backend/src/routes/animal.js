const router = require("express").Router();
const controller = require("../apis/animal/api/animal");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");

async function listAnimals(req, res) {
  try {
    const result = await controller.listAnimals(req, res);

    successResponse("List of animals fetched successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

router.get("/list", isAuthorized, listAnimals);

module.exports = router;
