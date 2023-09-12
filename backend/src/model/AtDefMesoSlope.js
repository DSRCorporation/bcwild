const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/ArialTelemetry.json");
const { createDefInit } = require("./createDefInit");

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

const init = createDefInit(AtDefMesoSlope, datasheetTypes, "MesoSlope");

module.exports = {
  AtDefMesoSlope,
  init,
};
