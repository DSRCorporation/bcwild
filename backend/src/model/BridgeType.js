const { DataTypes } = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { createDefInit } = require("./createDefInit");

const BridgeType = db.sequelize.define(
  "bb_def_type",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    value: {
      type: DataTypes.STRING(40),
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

const init = createDefInit(BridgeType, datasheetTypes, "BridgeType");

module.exports = {
  BridgeType,
  init,
};
