const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

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

async function init() {
  await BatRecording.sync({ force: true });
  await BatRecording.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "BatRecording").values,
  );
}

module.exports = {
  BatRecording,
  init,
};
