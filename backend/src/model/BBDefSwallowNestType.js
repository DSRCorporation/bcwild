const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

const BBDefSwallowNestType = db.sequelize.define(
  "bb_def_swallow_nest_type",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.STRING(64),
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

addAutoPopulateHook(BBDefSwallowNestType, datasheetTypes, "SwallowNestType");

module.exports = {
  BBDefSwallowNestType,
};
