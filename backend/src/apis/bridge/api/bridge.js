const services = require("../service/bridge");

const listBridges = async (req) => services.listBridges(req);

module.exports = {
  listBridges,
};
