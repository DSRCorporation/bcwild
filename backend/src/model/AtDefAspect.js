const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/ArialTelemetry.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

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

addAutoPopulateHook(AtDefAspect, datasheetTypes, "Aspect");

module.exports = {
  AtDefAspect,
};
