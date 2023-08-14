const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BatSign = db.sequelize.define(
  "bb_def_sign",
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
  await BatSign.sync({ force: true });
  await BatSign.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "BatSign"),
  );
}

module.exports = {
  BatSign,
  init,
};
