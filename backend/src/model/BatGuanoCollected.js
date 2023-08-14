const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BatGuanoCollected = db.sequelize.define(
  "bb_def_guano_collected",
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

async function init() {
  await BatGuanoCollected.sync({ force: true });
  await BatGuanoCollected.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "GuanoCollected").values,
  );
}

module.exports = {
  BatGuanoCollected,
  init,
};
