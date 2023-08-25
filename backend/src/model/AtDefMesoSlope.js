const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/ArialTelemetry.json");

const AtDefMesoSlope = db.sequelize.define(
  "at_def_meso_slope",
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
  await AtDefMesoSlope.sync({ force: true });
  await AtDefMesoSlope.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "MesoSlope"),
  );
}

module.exports = {
  AtDefMesoSlope,
  init,
};
