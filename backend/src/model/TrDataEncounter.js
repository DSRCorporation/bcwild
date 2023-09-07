const { DataTypes } = require("sequelize");
const db = require("../config/database");
const {
  setOptionalProperty,
  setMandatoryProperty,
} = require("../helpers/commonSequelizeQueries");
const { TrDataStand } = require("./TrDataStand");
const { TrDefReliability } = require("./TrDefs");

const TrDataEncounter = db.sequelize.define("tr_data_encounter", {
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
  // external
  Observation_ID: {
    type: DataTypes.INTEGER,
  },
  Coordinate_Northing_observation: {
    type: DataTypes.REAL,
  },
  Coordinate_Easting_observation: {
    type: DataTypes.REAL,
  },
  Waypoint: {
    type: DataTypes.STRING,
  },
  Distance_along_transect: {
    type: DataTypes.REAL,
  },
  // Spec: species is a "4-letter species code of potential prey and mustelids".
  // Shall we have a table of species?
  Species: {
    type: DataTypes.STRING,
  },
  Number_of_observations: {
    type: DataTypes.INTEGER,
  },
  Comments: {
    type: DataTypes.STRING,
  },
  Scat_ID: {
    type: DataTypes.STRING,
  },
});

setOptionalProperty(TrDataEncounter, TrDefReliability, "Reliability");
setMandatoryProperty(TrDataEncounter, TrDataStand, "standId");

module.exports = {
  TrDataEncounter,
};
