const services = require("../service/user");

const registration = async (req) => await services.registration(req);

const login = async (req) => await services.login(req);

const generateAccessToken = async (req) =>
  await services.generateAccessToken(req);

const updateProfilePhoto = async (req) =>
  await services.updateProfilePhoto(req);

const userDetails = async (req) => await services.userDetails(req);

module.exports = {
  registration,
  login,
  generateAccessToken,
  updateProfilePhoto,
  userDetails,
};
