const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Bridge = db.sequelize.define("bridge", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
});

module.exports = {
  Bridge,
};
