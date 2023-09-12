const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { createDefInit } = require("./createDefInit");

const BatGuanoDistribution = db.sequelize.define(
  "bb_def_guano_distribution",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

const init = createDefInit(
  BatGuanoDistribution,
  datasheetTypes,
  "GuanoDistribution",
);

module.exports = {
  BatGuanoDistribution,
  init,
};
