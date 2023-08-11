const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeColumns = db.sequelize.define(
  "bb_def_columns",
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
  await BridgeColumns.sync({ force: true });
  await BridgeColumns.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "Columns").values,
  );
}

module.exports = {
  BridgeColumns,
  init,
};
