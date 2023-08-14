const { DataTypes } = require("sequelize");
const db = require("../config/database");
const {
  setMandatoryProperty,
  setOptionalProperty,
} = require("../helpers/commonSequelizeQueries");
const { Assessment } = require("./Assessment");
const { Bridge } = require("./Bridge");
const { BridgeWater } = require("./BridgeWater");
const { BatGuanoAmount } = require("./BatGuanoAmount");
const { BatGuanoDistribution } = require("./BatGuanoDistribution");
const { BatGuanoCollected } = require("./BatGuanoCollected");

const BridgeObservation = db.sequelize.define("bb_data_observation", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  timestamp: {
    allowNull: false,
    type: DataTypes.DATE,
    unique: "bridge-timestamp",
  },
  emergencyBatCountDone: {
    type: DataTypes.BOOLEAN,
  },
  batRecordings: {
    allowNull: false,
    type: DataTypes.INTEGER,
    default: 0,
  },
  swallowNestType: {
    type: DataTypes.INTEGER,
  },
  swallowsFlying: {
    type: DataTypes.BOOLEAN,
  },
  speciesComment: {
    type: DataTypes.STRING,
  },
});

setMandatoryProperty(BridgeObservation, Bridge);
setOptionalProperty(BridgeObservation, BridgeWater);
setOptionalProperty(
  BridgeObservation,
  Assessment,
  "roostNightAssessmentAssessment",
);
setOptionalProperty(
  BridgeObservation,
  Assessment,
  "roostDayAssessmentAssessment",
);
setOptionalProperty(BridgeObservation, Assessment, "maternityAssessment");

setOptionalProperty(BridgeObservation, BatGuanoAmount);
setOptionalProperty(BridgeObservation, BatGuanoDistribution);
setOptionalProperty(BridgeObservation, BatGuanoCollected);

// TODO: add constraint: guano fields are null if and only if there's not guano
// TODO: add constraint: guano fields are null if and only if there's not guano

module.exports = {
  BridgeObservation,
};
