const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/BatsAndBridges.json");

const Assessment = db.sequelize.define(
  "def_assessment",
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
  await Assessment.sync({ force: true });
  await Assessment.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "Assessment").values,
  );
}

module.exports = {
  Assessment,
  init,
};
