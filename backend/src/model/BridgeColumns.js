const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { createDefInit } = require("./createDefInit");

const BridgeColumns = db.sequelize.define(
  "bb_def_columns",
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

const init = createDefInit(BridgeColumns, datasheetTypes, "Columns");

module.exports = {
  BridgeColumns,
  init,
};
