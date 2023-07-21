const { DataTypes } = require("sequelize");
const db = require("../config/database");

const BridgeHistory = db.sequelize.define(
  "bb_data_history",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: "bb_data_history",
  },
);

module.exports = {
  BridgeHistory,
};
