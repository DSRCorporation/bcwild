const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { BatGuanoAmount } = require("./BatGuanoAmount");
const { setMandatoryProperty } = require("../helpers/commonSequelizeQueries");
const { BatGuanoDistribution } = require("./BatGuanoDistribution");
const { BatGuanoCollected } = require("./BatGuanoCollected");

const BatGuanoData = db.sequelize.define(
  "bb_data_guano",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    sampleLabel: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "bb_data_guano",
  },
);

setMandatoryProperty(BatGuanoData, BatGuanoAmount);
setMandatoryProperty(BatGuanoData, BatGuanoDistribution);
setMandatoryProperty(BatGuanoData, BatGuanoCollected);

module.exports = {
  BatGuanoData,
};
