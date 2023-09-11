const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/ArialTelemetry.json");
const { createDefInit } = require("./createDefInit");

const AtDefMacroPosition = db.sequelize.define(
  "at_def_macro_position",
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

const init = createDefInit(AtDefMacroPosition, datasheetTypes, "MacroPosition");

module.exports = {
  AtDefMacroPosition,
  init,
};
