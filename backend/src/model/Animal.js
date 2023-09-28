const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Animal = db.sequelize.define("animal", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  stringId: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
});

module.exports = {
  Animal,
};
