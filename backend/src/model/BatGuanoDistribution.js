const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const BatGuanoDistribution = db.sequelize.define(
  "bb_def_guano_distribution",
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
  await BatGuanoDistribution.sync({ force: true });
  await BatGuanoDistribution.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "GuanoDistribution")
      .values,
  );
}

module.exports = {
  BatGuanoDistribution,
  init,
};
