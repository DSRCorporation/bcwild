const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeWater = db.sequelize.define(
  "bb_def_water",
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
  await BridgeWater.sync({ force: true });
  await BridgeWater.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "Water").values,
  );
}

module.exports = {
  BridgeWater,
  init,
};
