const services = require("../service/animal");

const listAnimals = async (req) => services.listAnimals(req);

module.exports = {
  listAnimals,
};
