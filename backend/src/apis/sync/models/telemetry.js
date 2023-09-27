const Sequelize = require("sequelize");
const db = require("../../../config/database");

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
    longitude: {
      type: Sequelize.DOUBLE,
    },
    latitude: {
      type: Sequelize.DOUBLE,
    },
    easting: {
      type: Sequelize.DOUBLE,
    },
    northing: {
      type: Sequelize.DOUBLE,
    },
    easting_error: {
      type: Sequelize.DOUBLE,
    },
    northing_error: {
      type: Sequelize.DOUBLE,
    },
    error_area: {
      type: Sequelize.DOUBLE,
    },
    location_comments: {
      type: Sequelize.TEXT,
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
