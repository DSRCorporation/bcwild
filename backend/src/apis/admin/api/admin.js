const services = require("../service/admin");
const signupRequestServices = require("../service/handleRequests");

const login = async (req) => await services.login(req);

const handleSignupRequests = async (req) =>
  await signupRequestServices.signupRequestsHandler(req);

const showSignupAccess = async (req) =>
  await signupRequestServices.showSignupRequests(req);

module.exports = {
  login,
  handleSignupRequests,
  showSignupAccess,
};
