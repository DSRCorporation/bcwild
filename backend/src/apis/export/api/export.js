const services = require("../service/export");

const exportData = async (req) => await services.exportData(req);

module.exports = {
  exportData,
};
