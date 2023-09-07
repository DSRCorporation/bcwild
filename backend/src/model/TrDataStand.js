const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { setMandatoryProperty } = require("../helpers/commonSequelizeQueries");
const { TrDataTransect } = require("./TrDataTransect");

const TrDataStand = db.sequelize.define("tr_data_stand", {
  // internal
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  // external
  Stand_ID: {
    type: DataTypes.STRING,
  },
  Distance_along_transect: {
    type: DataTypes.REAL,
  },
  Coordinate_Northing: {
    type: DataTypes.REAL,
  },
  Coordinate_Easting: {
    type: DataTypes.REAL,
  },
  BEU: {
    type: DataTypes.STRING,
  },
  Site_series: {
    type: DataTypes.STRING,
  },
  Structural_stage: {
    type: DataTypes.STRING,
  },
});

setMandatoryProperty(TrDataStand, TrDataTransect, "transectId");

module.exports = {
  TrDataStand,
};
