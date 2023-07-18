const router = require("express").Router();
const controller = require("../apis/forgetPassword/api/forgetPassword");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { isAuthorized } = require("../helpers/auth");

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", isAuthorized, resetPassword);

async function forgotPassword(req, res) {
  try {
    const result = await controller.forgetPassword(req, res);

    successResponse(
      "Reset password sent on your email id successfully",
      {},
      res,
    );
  } catch (error) {
    errorResponse(error, res);
  }
}

async function resetPassword(req, res) {
  try {
    const result = await controller.resetPassword(req, res);

    successResponse("Password changed successfully", {}, res);
  } catch (error) {
    errorResponse(error, res);
  }
}

module.exports = router;
