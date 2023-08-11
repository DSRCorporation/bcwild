const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeBeams = db.sequelize.define(
  "bb_def_beams",
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

async function init() {
  await BridgeBeams.sync({ force: true });
  await BridgeBeams.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "Beams").values,
  );
}

module.exports = {
  BridgeBeams,
  init,
};
