const services = require("../service/user");

const registration = async (req) => services.registration(req);

const login = async (req) => services.login(req);

const generateAccessToken = async (req) => services.generateAccessToken(req);

const updateProfilePhoto = async (req) => services.updateProfilePhoto(req);

const userDetails = async (req) => services.userDetails(req);

module.exports = {
  registration,
  login,
  generateAccessToken,
  updateProfilePhoto,
  userDetails,
};
