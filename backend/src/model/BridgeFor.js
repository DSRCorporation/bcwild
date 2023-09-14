const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

const BridgeFor = db.sequelize.define(
  "bb_def_for",
  {
    bit: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.STRING(16),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

addAutoPopulateHook(BridgeFor, datasheetTypes, "BridgeFor", {
  primaryKey: "bit",
  valuesTransform: (values) =>
    values.map(({ id, value }) => ({ bit: id, value })),
});

module.exports = {
  BridgeFor,
};
