const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeFor = db.sequelize.define(
  "bb_def_for",
  {
    bit: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  },
);

async function init() {
  await BridgeFor.sync({ force: true });
  await BridgeFor.bulkCreate(
    datasheetTypes.types
      .find(({ name }) => name === "BridgeFor")
      .values.map(({ id, value }) => ({ bit: id, value })),
  );
}

module.exports = {
  BridgeFor,
  init,
};
