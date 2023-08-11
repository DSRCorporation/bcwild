const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeCrossingType = db.sequelize.define(
  "bb_def_crossing_type",
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
  await BridgeCrossingType.sync({ force: true });
  await BridgeCrossingType.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "CrossingType").values,
  );
}

module.exports = {
  BridgeCrossingType,
  init,
};
