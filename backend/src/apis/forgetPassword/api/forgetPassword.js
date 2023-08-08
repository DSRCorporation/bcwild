const services = require("../service/forgetPassword");

const forgetPassword = async (req) => services.forgetPassword(req);

const resetPassword = async (req) => services.resetPassword(req);

module.exports = {
  forgetPassword,
  resetPassword,
};
