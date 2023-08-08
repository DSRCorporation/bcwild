const router = require("express").Router();
const controller = require("../apis/project/api/project");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");

async function add(req, res) {
  try {
    const result = await controller.addProject(req, res);

    successResponse("Project added successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

async function list(req, res) {
  try {
    const result = await controller.projectList(req, res);

    successResponse("Project list fetched successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

async function accessRequest(req, res) {
  try {
    const result = await controller.projectRequest(req, res);
    successResponse("Project request sent successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

async function requestList(req, res) {
  try {
    const result = await controller.projectRequestList(req, res);
    successResponse("Project request list fetched successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

async function projectRequestStatusHandler(req, res) {
  try {
    const result = await controller.projectRequestStatusHandler(req, res);
    successResponse("Project request status changed successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

router.post("/user/project", isAuthorized, add);
router.get("/user/project", isAuthorized, list);
router.post("/user/project/accessRequest", isAuthorized, accessRequest);

router.get("/admin/project/requestList", isAuthorized, requestList);
router.post(
  "/admin/project/changeProjectRequestStatus",
  isAuthorized,
  projectRequestStatusHandler,
);

module.exports = router;
