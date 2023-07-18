const httpStatusCodes = require("../errorHandler/httpStatusCodes");

const successResponse = (message, result, res) =>
  res.status(httpStatusCodes.OK).json({
    type: "success",
    status: httpStatusCodes.OK,
    message,
    data: result,
  });

const errorResponse = (error, res) => {
  if (
    error.message ==
    "Can't send mail - all recipients were rejected: 550 unrouteable address"
  ) {
    (error.message =
      "Invalid Email Address - Please check the email address and try again"),
      (error.status = httpStatusCodes.BAD_REQUEST);
  }
  const type = error.name == "Warning" ? "warning" : "error";
  return res.status(error.status || httpStatusCodes.INTERNAL_SERVER).json({
    type,
    status: error.status || httpStatusCodes.INTERNAL_SERVER,
    message: error.message || "Internal server error",
    data: error.data ? error.data : {},
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
