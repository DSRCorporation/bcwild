const Sequelize = require("sequelize");
const db = require("../config/database");

const Road = db.sequelize.define("road", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(),
    unique: true,
    allowNull: false,
  },
});

module.exports = {
  Road,
};
