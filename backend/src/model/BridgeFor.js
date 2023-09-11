const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeFor = db.sequelize.define(
  "bb_def_for",
  {
    bit: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.STRING(16),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

async function init(transaction) {
  await BridgeFor.bulkCreate(
    datasheetTypes.types
      .find(({ name }) => name === "BridgeFor")
      .values.map(({ id, value }) => ({ bit: id, value })),
    { transaction, updateOnDuplicate: ["bit"] },
  );
}

module.exports = {
  BridgeFor,
  init,
};
