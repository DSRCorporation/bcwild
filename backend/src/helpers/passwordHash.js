const bcrypt = require("bcrypt");

const generateHash = (password) => bcrypt.hash(password, bcrypt.genSaltSync(8));
const validPassword = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

module.exports = {
  generateHash,
  validPassword,
};
