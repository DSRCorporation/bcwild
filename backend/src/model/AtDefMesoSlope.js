const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/ArialTelemetry.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

const AtDefMesoSlope = db.sequelize.define(
  "at_def_meso_slope",
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

addAutoPopulateHook(AtDefMesoSlope, datasheetTypes, "MesoSlope");

module.exports = {
  AtDefMesoSlope,
};
