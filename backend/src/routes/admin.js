const router = require("express").Router();
const adminController = require("../apis/admin/api/admin");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");
// router.post('/login',login)
router.get("/signupRequests", isAuthorized, showSignupRequests);
router.post("/changeSignupAccessStatus", isAuthorized, signupRequestsHandler);

async function login(req, res) {
  try {
    const result = await adminController.login(req, res);

    successResponse("Login successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

async function showSignupRequests(req, res) {
  try {
    const result = await adminController.showSignupAccess(req, res);

    successResponse("Signup requests fetched successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

async function signupRequestsHandler(req, res) {
  try {
    const result = await adminController.handleSignupRequests(req, res);

    successResponse("Signup access status changed successfully", result, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

module.exports = router;
