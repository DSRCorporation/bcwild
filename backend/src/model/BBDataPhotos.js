const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { setMandatoryProperty } = require("../helpers/commonSequelizeQueries");
const { BridgeObservation } = require("./BridgeObservation");

const BBDataPhotos = db.sequelize.define("bb_data_photos", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  image: {
    allowNull: false,
    type: DataTypes.STRING,
  },
});

setMandatoryProperty(BBDataPhotos, BridgeObservation, "bridgeObservationId");

module.exports = {
  BBDataPhotos,
};
