const Sequelize = require("sequelize");
const db = require("../../../config/database");

const ExportLog = db.sequelize.define(
  "export_log",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.SMALLINT,
    },
    username: {
      type: Sequelize.STRING(50),
    },
    project_id: {
      type: Sequelize.STRING(50),
    },
    export_email: {
      type: Sequelize.STRING(75),
    },
  },
  { timestamps: true, underscored: true },
);

// ExportLog.sync().then()
module.exports = ExportLog;
