const { DataTypes } = require("sequelize");
const db = require("../config/database");
const { setMandatoryProperty } = require("../helpers/commonSequelizeQueries");
const { AtData } = require("./AtData");

const AtDataPhotos = db.sequelize.define("at_data_photos", {
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

setMandatoryProperty(AtDataPhotos, AtData, "aerialTelemetryId");

module.exports = {
  AtDataPhotos,
};
