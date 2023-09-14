const { DataTypes } = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

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

addAutoPopulateHook(BridgeType, datasheetTypes, "BridgeType");

module.exports = {
  BridgeType,
};
