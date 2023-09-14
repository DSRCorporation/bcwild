const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

const BridgeHabitat = db.sequelize.define(
  "bb_def_habitat",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.STRING(20),
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

addAutoPopulateHook(BridgeHabitat, datasheetTypes, "Habitat");

module.exports = {
  BridgeHabitat,
};
