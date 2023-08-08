const services = require("../service/admin");
const signupRequestServices = require("../service/handleRequests");

const login = async (req) => services.login(req);

const handleSignupRequests = async (req) =>
  signupRequestServices.signupRequestsHandler(req);

const showSignupAccess = async (req) =>
  signupRequestServices.showSignupRequests(req);

module.exports = {
  login,
  handleSignupRequests,
  showSignupAccess,
};
