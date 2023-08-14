const { DataTypes } = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeType = db.sequelize.define(
  "bb_def_type",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    value: {
      type: DataTypes.STRING(40),
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

async function init() {
  await BridgeType.sync({ force: true });
  await BridgeType.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "BridgeType").values,
  );
}

module.exports = {
  BridgeType,
  init,
};
