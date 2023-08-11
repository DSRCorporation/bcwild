const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeHabitat = db.sequelize.define(
  "bb_def_habitat",
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
  await BridgeHabitat.sync({ force: true });
  await BridgeHabitat.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "Habitat").values,
  );
}

module.exports = {
  BridgeHabitat,
  init,
};
