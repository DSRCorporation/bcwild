// 'use strict';
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "local";
const config = require("./config.json")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = Sequelize.DataTypes;

sequelize
  .sync()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Sync Complete");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Error in syncing", err);
  });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;xxxxxx

module.exports = db;
