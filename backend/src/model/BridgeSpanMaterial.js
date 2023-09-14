const { DataTypes } = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

const BridgeSpanMaterial = db.sequelize.define(
  "bb_def_span_material",
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

addAutoPopulateHook(BridgeSpanMaterial, datasheetTypes, "SpanMaterial");

module.exports = {
  BridgeSpanMaterial,
};
