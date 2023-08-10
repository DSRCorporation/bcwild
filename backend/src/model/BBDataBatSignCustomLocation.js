const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { BatSign } = require("./BatSign");
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
  },
);

BBDataBatSignCustomLocation.belongsTo(BatSign, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});
BatSign.hasMany(BBDataBatSignCustomLocation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

BBDataBatSignCustomLocation.belongsTo(BridgeObservation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

BridgeObservation.hasMany(BBDataBatSignCustomLocation, {
  foreignKey: {
    allowNull: false,
    unique: observationLocationSignUniqueness,
  },
});

module.exports = {
  BBDataBatSignCustomLocation,
};
