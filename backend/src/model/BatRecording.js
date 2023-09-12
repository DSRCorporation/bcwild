const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");
const { createDefInit } = require("./createDefInit");

const BatRecording = db.sequelize.define(
  "bb_def_bat_recording",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.STRING(40),
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

const init = createDefInit(BatRecording, datasheetTypes, "BatRecording");

module.exports = {
  BatRecording,
  init,
};
