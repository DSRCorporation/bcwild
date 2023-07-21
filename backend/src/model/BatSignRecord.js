const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { BatSignLocation } = require("./BatSignLocation");
const { BridgeObservation } = require("./BridgeObservation");

const BatSignRecord = db.sequelize.define("bb_def_sign_record", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  bitmask: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

BatSignLocation.hasMany(BatSignRecord);
BatSignRecord.belongsTo(BatSignLocation, {
  foreignKey: {
    allowNull: true, // null for "other" locations
    unique: "observation-location",
  },
});

BridgeObservation.hasMany(BatSignRecord, {
  foreignKey: {
    allowNull: false,
  },
});

BatSignRecord.belongsTo(BridgeObservation, {
  foreignKey: {
    allowNull: false,
    unique: "observation-location",
  },
});

module.exports = {
  BatSignRecord,
};
