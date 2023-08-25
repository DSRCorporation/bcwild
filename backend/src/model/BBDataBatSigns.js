const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { BatSign } = require("./BatSign");
const { BridgeObservation } = require("./BridgeObservation");

const observationSignUniqueness = "observationSign";

const BBDataBatSign = db.sequelize.define("bb_data_bat_sign", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  isPresent: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
});

BBDataBatSign.belongsTo(BridgeObservation, {
  foreignKey: {
    allowNull: false,
    name: "bridgeObservation",
    unique: observationSignUniqueness,
  },
});

BridgeObservation.hasMany(BBDataBatSign, {
  foreignKey: {
    allowNull: false,
    name: "bridgeObservation",
    unique: observationSignUniqueness,
  },
});

BBDataBatSign.belongsTo(BatSign, {
  foreignKey: {
    allowNull: false,
    name: "batSign",
    unique: observationSignUniqueness,
  },
});

BatSign.hasMany(BBDataBatSign, {
  foreignKey: {
    allowNull: false,
    name: "batSign",
    unique: observationSignUniqueness,
  },
});

module.exports = {
  BBDataBatSign,
};
