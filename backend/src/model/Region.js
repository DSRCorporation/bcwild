const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const Region = db.sequelize.define(
  "region",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(20),
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

async function init() {
  await Region.sync({ force: true });
  await Region.bulkCreate(
    datasheetTypes.types
      .find(({ name }) => name === "Region")
      .values.map(({ id, value }) => ({ id, name: value })),
  );
}

module.exports = {
  Region,
  init,
};
