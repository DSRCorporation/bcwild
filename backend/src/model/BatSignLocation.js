const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BatSignLocation = db.sequelize.define(
  "bb_def_location",
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

async function init() {
  await BatSignLocation.sync({ force: true });
  await BatSignLocation.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "BatSignLocation").values,
  );
}

module.exports = {
  BatSignLocation,
  init,
};
