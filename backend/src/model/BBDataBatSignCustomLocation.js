const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { BridgeObservation } = require("./BridgeObservation");

const observationLocationSignUniqueness = "observationLocationSign";

const BBDataBatSignCustomLocation = db.sequelize.define(
  "bb_data_bat_sign_custom_location",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: observationLocationSignUniqueness,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: observationLocationSignUniqueness,
    },
  },
);

BBDataBatSignCustomLocation.belongsTo(BridgeObservation, {
  foreignKey: {
    allowNull: false,
    name: "bridgeObservation",
    unique: observationLocationSignUniqueness,
  },
});

BridgeObservation.hasMany(BBDataBatSignCustomLocation, {
  foreignKey: {
    allowNull: false,
    name: "bridgeObservation",
    unique: observationLocationSignUniqueness,
  },
});

module.exports = {
  BBDataBatSignCustomLocation,
};
