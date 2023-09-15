const Sequelize = require("sequelize");
const db = require("../../../config/database");
const {setMandatoryProperty} = require("../../../helpers/commonSequelizeQueries");

const CameraTrapData = db.sequelize.define(
  "camera_trap_data",
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
    field_crew: {
      type: Sequelize.STRING(50),
    },
    date_time: {
      type: Sequelize.STRING(50),
    },
    station_id: {
      type: Sequelize.STRING(50),
    },
    deploy_check: {
      type: Sequelize.STRING(50),
    },
    station_northing: {
      type: Sequelize.STRING(50),
    },
    station_easting: {
      type: Sequelize.STRING(50),
    },
    camera_attached: {
      type: Sequelize.STRING(50),
    },
    security_box: {
      type: Sequelize.STRING(50),
    },
    camera_height: {
      type: Sequelize.STRING(50),
    },
    camera_compass_direction: {
      type: Sequelize.STRING(50),
    },
    camera_id: {
      type: Sequelize.STRING(50),
    },
    camera_make: {
      type: Sequelize.STRING(50),
    },
    camera_model: {
      type: Sequelize.STRING(50),
    },
    sd_card_id: {
      type: Sequelize.STRING(50),
    },
    key_id: {
      type: Sequelize.STRING(50),
    },
    visibility: {
      type: Sequelize.STRING(50),
    },
    habitat_type: {
      type: Sequelize.STRING(50),
    },
    target_feature: {
      type: Sequelize.STRING(50),
    },
    distant_feature: {
      type: Sequelize.STRING(50),
    },
    quiet_period: {
      type: Sequelize.STRING(50),
    },
    trigger_sensitivity: {
      type: Sequelize.STRING(50),
    },
    trigger_timing: {
      type: Sequelize.STRING(50),
    },
    photos_trigger: {
      type: Sequelize.STRING(50),
    },
    bait_lure: {
      type: Sequelize.STRING(50),
    },
    camera_active: {
      type: Sequelize.STRING(50),
    },
    comments: {
      type: Sequelize.TEXT,
    },
    camera_damaged: {
      type: Sequelize.TEXT,
    },
    number_of_photos: {
      type: Sequelize.STRING(50),
    },
    battery_percent: {
      type: Sequelize.STRING(50),
    },
    purpose_visit: {
      type: Sequelize.STRING(50),
    },
    camera_removed: {
      type: Sequelize.STRING(50),
    },
    camera_replaced: {
      type: Sequelize.STRING(50),
    },
    batteries_replaced: {
      type: Sequelize.STRING(50),
    },
    sd_card_replaced: {
      type: Sequelize.STRING(50),
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

const CameraTrapDataPhotos = db.sequelize.define("camera_trap_data_photos", {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  image: {
    allowNull: false,
    type: Sequelize.STRING,
  },
});

setMandatoryProperty(CameraTrapDataPhotos, CameraTrapData, "cameraTrapDataId");

module.exports = {
  CameraTrapData,
  CameraTrapDataPhotos,
};
