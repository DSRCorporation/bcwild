const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeAbutment = db.sequelize.define(
  "bb_def_abutment",
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
  await BridgeAbutment.sync({ force: true });
  await BridgeAbutment.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "Abutment").values,
  );
}

module.exports = {
  BridgeAbutment,
  init,
};
