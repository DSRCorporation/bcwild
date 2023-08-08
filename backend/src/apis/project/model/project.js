const Sequelize = require("sequelize");
const User = require("../../user/model/user");
const db = require("../../../config/database");

const Project = db.sequelize.define(
  "project",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.SMALLINT,
    },
    username: {
      type: Sequelize.STRING(20),
    },
    project_id: {
      type: Sequelize.STRING(20),
      unique: true,
      allowNull: false,
    },
    study_area: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    survey_id: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    creation_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  { timestamps: true, underscored: true },
);

Project.belongsTo(User, {
  foreignKey: "username",
  targetKey: "username",
  as: "user",
});

module.exports = Project;
