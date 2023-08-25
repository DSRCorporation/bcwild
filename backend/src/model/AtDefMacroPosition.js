const Sequelize = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/ArialTelemetry.json");

const AtDefMacroPosition = db.sequelize.define(
  "at_def_macro_position",
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
  await AtDefMacroPosition.sync({ force: true });
  await AtDefMacroPosition.bulkCreate(
    datasheetTypes.types.find(({ name }) => name === "MacroPosition"),
  );
}

module.exports = {
  AtDefMacroPosition,
  init,
};
