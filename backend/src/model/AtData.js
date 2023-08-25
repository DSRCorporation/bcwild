const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { setOptionalProperty } = require("../helpers/commonSequelizeQueries");
const { Animal } = require("./Animal");
const { AtDefAspect } = require("./AtDefAspect");
const { AtDefMacroPosition } = require("./AtDefMacroPosition");
const { AtDefMesoSlope } = require("./AtDefMesoSlope");

const AtData = db.sequelize.define("at_data", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  time: {
    allowNull: false,
    type: DataTypes.DATE,
    unique: "location-timestamp",
  },
  locationId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "location-timestamp",
  },
  easting: {
    type: DataTypes.REAL,
  },
  northing: {
    type: DataTypes.REAL,
  },
  latitude: {
    type: DataTypes.REAL,
  },
  longitude: {
    type: DataTypes.REAL,
  },
  frequency: {
    type: DataTypes.REAL,
  },
  gpsID: {
    type: DataTypes.STRING,
  },
  habitatType: {
    type: DataTypes.STRING,
  },
  locationTime: {
    type: DataTypes.DATE,
  },
  navigator: {
    type: DataTypes.STRING,
  },
  observer: {
    type: DataTypes.STRING,
  },
  pilot: {
    type: DataTypes.STRING,
  },
  waypoint: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
  },
});

setOptionalProperty(AtData, Animal, "animalId");
setOptionalProperty(AtData, AtDefAspect, "aspectId");
setOptionalProperty(AtData, AtDefMesoSlope, "mesoSlopeId");
setOptionalProperty(AtData, AtDefMacroPosition, "macroPositionId");

module.exports = {
  AtData,
};
