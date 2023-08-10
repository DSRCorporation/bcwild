const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeUnderdeck = db.sequelize.define(
  "bb_def_underdeck",
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
  await BridgeUnderdeck.sync({ force: true });
  await BridgeUnderdeck.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "Underdeck").values,
  );
}

module.exports = {
  BridgeUnderdeck,
  init,
};
