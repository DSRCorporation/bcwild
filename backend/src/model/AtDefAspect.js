const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/ArialTelemetry.json");
const { createDefInit } = require("./createDefInit");

const AtDefAspect = db.sequelize.define(
  "at_def_aspect",
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

const init = createDefInit(AtDefAspect, datasheetTypes, "Aspect");

module.exports = {
  AtDefAspect,
  init,
};
