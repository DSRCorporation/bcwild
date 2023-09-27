const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { Bridge } = require("./Bridge");
const { BridgeHabitat } = require("./BridgeHabitat");
const { BridgeAbutment } = require("./BridgeAbutment");
const { BridgeSpanMaterial } = require("./BridgeSpanMaterial");
const { BridgeType } = require("./BridgeType");
const { BridgeUnderdeck } = require("./BridgeUnderdeck");
const { Region } = require("./Region");
const { setOptionalProperty } = require("../helpers/commonSequelizeQueries");
const { BridgeBeams } = require("./BridgeBeams");
const { BridgeColumns } = require("./BridgeColumns");
const { BridgeCrossingType } = require("./BridgeCrossingType");

const BridgeConfiguration = db.sequelize.define(
  "bb_data_bridge_configuration",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: "id-mot",
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    time: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    name: {
      type: DataTypes.STRING,
    },
    roadName: {
      type: DataTypes.STRING,
    },
    motBridgeID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "id-mot",
    },
    longitude: {
      type: DataTypes.DOUBLE,
    },
    latitude: {
      type: DataTypes.DOUBLE,
    },
    easting: {
      type: DataTypes.DOUBLE,
    },
    northing: {
      type: DataTypes.DOUBLE,
    },
    height: {
      type: DataTypes.REAL,
      validate: {
        min: 0,
      },
    },
    length: {
      type: DataTypes.REAL,
      validate: {
        min: 0,
      },
    },
    habitatComments: {
      type: DataTypes.STRING,
    },
    bridgeForMask: {
      type: DataTypes.INTEGER,
    },
  },
);

Bridge.hasMany(BridgeConfiguration);
BridgeConfiguration.belongsTo(Bridge);

setOptionalProperty(BridgeConfiguration, BridgeHabitat, "habitatId");
setOptionalProperty(BridgeConfiguration, Region, "regionId");
setOptionalProperty(BridgeConfiguration, BridgeType, "typeId");
setOptionalProperty(BridgeConfiguration, BridgeSpanMaterial, "spanMaterialId");
setOptionalProperty(BridgeConfiguration, BridgeAbutment, "abutmentId");
setOptionalProperty(BridgeConfiguration, BridgeUnderdeck, "underdeckId");
setOptionalProperty(BridgeConfiguration, BridgeBeams, "beamsId");
setOptionalProperty(BridgeConfiguration, BridgeColumns, "columnsId");
setOptionalProperty(BridgeConfiguration, BridgeCrossingType, "crossingTypeId");

// BridgeConfiguration.sync()

module.exports = {
  BridgeConfiguration,
};
