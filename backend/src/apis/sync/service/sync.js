const { Op } = require("sequelize");
const {
  customCreate,
  customDelete,
  customUpdate,
} = require("../sequelizeQuery/sync");
const Telemetry = require("../models/telemetry");
const CameraTrapData = require("../models/camera");
const { customFindAll } = require("../../../helpers/commonSequelizeQueries");
const { customErrors } = require("../../../errorHandler/error");
const { sequelize } = require("../../../config/database");

const pushChanges = async (req) => {
  let transaction;
  try {
    const { username } = req.decoded;

    transaction = await sequelize.transaction();

    for (const data of req.body) {
      const model = data.record_identifier.startsWith("TELE")
        ? Telemetry
        : CameraTrapData;
      data.data.created_by = username;
      data.data.record_identifier = data.record_identifier;
      await customCreate(
        model,
        data.data,
        { transaction },
        { record_identifier: data.record_identifier },
      );
    }

    await transaction.commit();
    return true;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    customErrors(error.name, error.message);
  }
};
const pullChanges = async (req) => {
  let { lastPulledAt } = req.body;
  lastPulledAt = new Date(lastPulledAt).toISOString();
  const { username } = req.decoded;
  let telemetryData = customFindAll(Telemetry, {
    project_id: ["Project1", "Project2"],
    updatedAt: { [Op.gt]: lastPulledAt },
  });

  let cameraTrapData = customFindAll(CameraTrapData, {
    project_id: ["Project1", "Project2"],
    updatedAt: { [Op.gt]: lastPulledAt },
  });

  // var bearingData = customFindAll(Bearing, { username: username, updatedAt: { [Op.gt]: lastPulledAt }})

  const result = await Promise.all([telemetryData, cameraTrapData]);
  [telemetryData, cameraTrapData] = result;

  return { telemetryData, cameraTrapData };
};

module.exports = {
  pushChanges,
  pullChanges,
};
