const services = require("../service/export");

const exportData = async (req) => services.exportData(req);

module.exports = {
  exportData,
};
