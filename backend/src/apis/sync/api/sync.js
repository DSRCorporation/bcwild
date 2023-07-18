const services = require("../service/sync");

const pushChanges = async (req) => services.pushChanges(req);

const pullChanges = async (req) => services.pullChanges(req);

module.exports = {
  pushChanges,
  pullChanges,
};
