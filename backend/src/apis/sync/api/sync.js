const services = require("../service/sync");

const pushChanges = async (req) => await services.pushChanges(req);

const pullChanges = async (req) => await services.pullChanges(req);

module.exports = {
  pushChanges,
  pullChanges,
};
