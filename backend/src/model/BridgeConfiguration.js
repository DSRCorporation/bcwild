const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { Bridge } = require("./Bridge");
const { BridgeHabitat } = require("./BridgeHabitat");
const { BridgeAbutment } = require("./BridgeAbutment");
const { BridgeSpanMaterial } = require("./BridgeSpanMaterial");
const { BridgeType } = require("./BridgeType");
const { BridgeUnderdeck } = require("./BridgeUnderdeck");
const { Region } = require("./Region");
const { Road } = require("./Road");

const BridgeConfiguration = db.sequelize.define("bb_data_configuration", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motBridgeID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  longitude: {
    type: DataTypes.REAL,
    allowNull: false,
    validate: {
      min: 0,
      max: 180,
    },
  },
  latitude: {
    type: DataTypes.REAL,
    allowNull: false,
    validate: {
      min: 0,
      max: 180,
    },
  },
  height: {
    type: DataTypes.REAL,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  habitatComment: {
    type: DataTypes.STRING,
  },
});

Bridge.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(Bridge);

Road.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(Road);

BridgeHabitat.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(BridgeHabitat);

Region.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(Region);

Road.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(Road);

BridgeType.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(BridgeType);

BridgeSpanMaterial.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(BridgeSpanMaterial);

BridgeAbutment.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(BridgeAbutment);

BridgeUnderdeck.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(BridgeUnderdeck);

module.exports = {
  BridgeConfiguration,
};
