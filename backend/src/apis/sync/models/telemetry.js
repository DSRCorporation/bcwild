"use strict";

const Sequelize = require("sequelize");
const Project = require("../../project/model/project");
const db = require("../../../config/database");
const User = require("../../user/model/user");
// const GroundTelemetry = require("./groundTelemetry");

const Telemetry = db.sequelize.define(
  "telemetry_data",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    record_identifier: {
      type: Sequelize.STRING(50),
    },
    project_id: {
      type: Sequelize.STRING(50),
    },
    survey_id: {
      type: Sequelize.STRING(50),
    },
    location_id: {
      type: Sequelize.STRING(50),
    },
    first_location_id: {
      type: Sequelize.STRING(50),
    },
    animal_id: {
      type: Sequelize.STRING(50),
    },
    ambient_temperature: {
      type: Sequelize.STRING(50),
    },
    date: {
      type: Sequelize.STRING(50),
    },
    cloud_cover: {
      type: Sequelize.STRING(50),
    },
    precip: {
      type: Sequelize.STRING(50),
    },
    wind: {
      type: Sequelize.STRING(50),
    },
    element_identified: {
      type: Sequelize.STRING(50),
    },
    location_comments: {
      type: Sequelize.TEXT,
    },
    bearing_id: {
      type: Sequelize.STRING(50),
    },
    bearing_easting: {
      type: Sequelize.STRING(50),
    },
    bearing_northing: {
      type: Sequelize.STRING(50),
    },
    time_bearing_collected: {
      type: Sequelize.STRING(50),
    },
    azimuth: {
      type: Sequelize.STRING(50),
    },
    signal_assessment: {
      type: Sequelize.STRING(50),
    },
    bias_assessment: {
      type: Sequelize.STRING(50),
    },
    bearing_notes: {
      type: Sequelize.TEXT,
    },
    triangulation_use: {
      type: Sequelize.STRING(50),
    },
    triangulation: {
      type: Sequelize.ARRAY(Sequelize.JSON),
    },
    created_by: {
      type: Sequelize.STRING(50),
    },
    updated_by: {
      type: Sequelize.STRING(50),
    },
  },
  { timestamps: true, underscored: true },
);

// Telemetry.belongsTo(Project,{
//     foreignKey:"project_id",
//     targetKey:"project_id",
//     as:"project"
// })

// Telemetry.belongsTo(User,{
//     foreignKey:"created_by",
//     targetKey:"username",
//     as:"user"
// })
// Telemetry.belongsTo(User,{
//     foreignKey:"updated_by",
//     targetKey:"username",
//     as:"user"
// })

// Telemetry.belongsTo(GroundTelemetry,{
//     foreignKey:"triangulation",
//     targetKey:"id",
//     as:"ground_telemetry"
// })

// Telemetry.sync({alter:true}).then()
module.exports = Telemetry;
