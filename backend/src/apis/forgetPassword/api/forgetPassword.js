const services = require("../service/forgetPassword");

const forgetPassword = async (req) => await services.forgetPassword(req);

const resetPassword = async (req) => await services.resetPassword(req);

module.exports = {
  forgetPassword,
  resetPassword,
};
