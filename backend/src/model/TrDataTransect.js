const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { setOptionalProperty } = require("../helpers/commonSequelizeQueries");
const {
  TrDefSurveyType,
  TrDefCloudCover,
  TrDefPrecipitation,
  TrDefWind,
} = require("./TrDefs");

const TrDataTransect = db.sequelize.define("tr_data_transect", {
  // internal
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  // internal
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // time
  time: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  // external
  Transect_ID: {
    type: DataTypes.STRING,
  },
  Field_crew: {
    type: DataTypes.STRING,
  },
  Date_Time: {
    type: DataTypes.DATE,
  },
  GPS_ID: {
    type: DataTypes.STRING,
  },
  Coordinate_Longitude_start: {
    type: DataTypes.DOUBLE,
  },
  Coordinate_Latitude_start: {
    type: DataTypes.DOUBLE,
  },
  Coordinate_Northing_start: {
    type: DataTypes.DOUBLE,
  },
  Coordinate_Easting_start: {
    type: DataTypes.DOUBLE,
  },
  Bearing_start: {
    type: DataTypes.REAL,
  },
  Snow_date: {
    type: DataTypes.DATE,
  },
  Snow_depth: {
    type: DataTypes.REAL,
  },
  Snow_amount: {
    type: DataTypes.REAL,
  },
  Transect_length: {
    type: DataTypes.REAL,
  },
  Coordinate_Longitude_end: {
    type: DataTypes.DOUBLE,
  },
  Coordinate_Latitude_end: {
    type: DataTypes.DOUBLE,
  },
  Coordinate_Northing_end: {
    type: DataTypes.DOUBLE,
  },
  Coordinate_Easting_end: {
    type: DataTypes.DOUBLE,
  },
  Temperature: {
    type: DataTypes.REAL,
  },
  transectTrackShapefile: {
    type: DataTypes.STRING,
  },
  encounterWaypointsShapefile: {
    type: DataTypes.STRING,
  },
});

setOptionalProperty(TrDataTransect, TrDefSurveyType, "Survey_Type");
setOptionalProperty(TrDataTransect, TrDefCloudCover, "Cloud_cover");
setOptionalProperty(TrDataTransect, TrDefPrecipitation, "Precipitation");
setOptionalProperty(TrDataTransect, TrDefWind, "Wind");

module.exports = {
  TrDataTransect,
};
