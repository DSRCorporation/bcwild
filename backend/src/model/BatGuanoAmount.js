const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BatGuanoAmount = db.sequelize.define(
  "bb_def_guano_amount",
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
  await BatGuanoAmount.sync({ force: true });
  await BatGuanoAmount.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "GuanoAmount").values,
  );
}

module.exports = {
  BatGuanoAmount,
  init,
};
