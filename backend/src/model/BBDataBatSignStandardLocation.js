const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { BatSign } = require("./BatSign");
const { BatSignLocation } = require("./BatSignLocation");
const { BridgeObservation } = require("./BridgeObservation");

const observationLocationSignUniqueness = "observationLocationSign";

const BBDataBatSignStandardLocation = db.sequelize.define(
  "bb_data_bat_sign_standard_location",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
  },
);

BBDataBatSignStandardLocation.belongsTo(BatSignLocation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

BatSignLocation.hasMany(BBDataBatSignStandardLocation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

BBDataBatSignStandardLocation.belongsTo(BatSign, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});
BatSign.hasMany(BBDataBatSignStandardLocation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

BBDataBatSignStandardLocation.belongsTo(BridgeObservation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

BridgeObservation.hasMany(BBDataBatSignStandardLocation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

module.exports = {
  BBDataBatSignStandardLocation,
};
