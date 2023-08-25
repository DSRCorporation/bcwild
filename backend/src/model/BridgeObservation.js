const { DataTypes } = require("sequelize");
const db = require("../config/database");
const {
  setOptionalProperty,
  setMandatoryProperty,
} = require("../helpers/commonSequelizeQueries");
const { Assessment } = require("./Assessment");
const { BridgeWater } = require("./BridgeWater");
const { BatGuanoAmount } = require("./BatGuanoAmount");
const { BatGuanoDistribution } = require("./BatGuanoDistribution");
const { Bridge } = require("./Bridge");

const BridgeObservation = db.sequelize.define("bb_data_observation", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  time: {
    allowNull: false,
    type: DataTypes.DATE,
    unique: "bridge-timestamp",
  },
  createdBy: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  emergenceBatCountDone: {
    type: DataTypes.BOOLEAN,
  },
  batRecordingsMask: {
    allowNull: false,
    type: DataTypes.INTEGER,
    default: 0,
  },
  batGuanoCollectedMask: {
    allowNull: false,
    type: DataTypes.INTEGER,
    default: 0,
  },
  batGuanoSampleLabel: {
    type: DataTypes.STRING,
  },
  swallowNestTypeMask: {
    type: DataTypes.INTEGER,
  },
  swallowsFlying: {
    type: DataTypes.BOOLEAN,
  },
  couldThisSiteBeSafelyOrEasilyNetted: {
    type: DataTypes.BOOLEAN,
  },
  wouldRoostingBatsBeReachableWithoutLadder: {
    type: DataTypes.BOOLEAN,
  },
  speciesComments: {
    type: DataTypes.STRING,
  },
  comments: {
    type: DataTypes.STRING,
  },
  observers: {
    type: DataTypes.STRING,
  },
});

setMandatoryProperty(BridgeObservation, Bridge, "bridgeId");
setOptionalProperty(BridgeObservation, BridgeWater, "water");
setOptionalProperty(BridgeObservation, Assessment, "roostNightAssessment");
setOptionalProperty(BridgeObservation, Assessment, "roostDayAssessment");
setOptionalProperty(BridgeObservation, Assessment, "maternityAssessment");

setOptionalProperty(BridgeObservation, BatGuanoAmount, "batGuanoAmount");
setOptionalProperty(
  BridgeObservation,
  BatGuanoDistribution,
  "batGuanoDistribution",
);

// TODO: add constraint: guano fields are null if and only if there's not guano
// TODO: add constraint: guano fields are null if and only if there's not guano

// BridgeObservation.sync();

module.exports = {
  BridgeObservation,
};
