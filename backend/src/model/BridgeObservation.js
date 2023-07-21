const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { setMandatoryProperty } = require("../helpers/commonSequelizeQueries");
const { Assessment } = require("./Assessment");
const { BridgeHistory } = require("./BridgeHistory");
const { BridgeWater } = require("./BridgeWater");

const BridgeObservation = db.sequelize.define("bb_data_observation", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  emergencyBatCountDone: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  }
});

BridgeHistory.hasMany(BridgeObservation);
BridgeObservation.belongsTo(BridgeHistory);

// null: no water
BridgeWater.hasMany(BridgeObservation);
BridgeObservation.belongsTo(BridgeWater);

setMandatoryProperty(BridgeObservation, Assessment, "roostNightAssessmentId");
setMandatoryProperty(BridgeObservation, Assessment, "roostDayAssessmentId");
setMandatoryProperty(BridgeObservation, Assessment, "maternity");

module.exports = {
  BridgeObservation,
};
