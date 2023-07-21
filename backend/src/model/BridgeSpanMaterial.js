const { DataTypes } = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BridgeSpanMaterial = db.sequelize.define(
  "bb_def_span_material",
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
  await BridgeSpanMaterial.sync({ force: true });
  await BridgeSpanMaterial.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "SpanMaterial").values,
  );
}

module.exports = {
  BridgeSpanMaterial,
  init,
};
