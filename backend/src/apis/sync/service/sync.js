const { Op } = require("sequelize");
const { customFindAll } = require("../../../helpers/commonSequelizeQueries");
const { customErrors } = require("../../../errorHandler/error");
const { sequelize } = require("../../../config/database");
const { pushers } = require("./pushers");

const getPusherForRecordIdentifier = (recordIdentifier) => {
  // eslint-disable-next-line no-console
  console.log(`Pushing record ${recordIdentifier}`);
  const defaultPusher = async () => {
    // eslint-disable-next-line no-console
    console.warn(
      `Don't know how to push changes for record identifier ${recordIdentifier}`,
    );
  };
  const split = recordIdentifier.split("_");
  if (split.length < 2) return defaultPusher;
  const prefix = split[0];
  if (!(prefix in pushers)) return defaultPusher;
  return pushers[prefix];
};

const pushChanges = async (req) =>
  sequelize.transaction(async (transaction) => {
    try {
      const { username } = req.decoded;
      // eslint-disable-next-line no-restricted-syntax
      for (const data of req.body) {
        const recordIdentifier = data.record_identifier;
        if (typeof recordIdentifier !== "string") {
          // eslint-disable-next-line no-console
          console.warn(`Invalid record identifier ${recordIdentifier}`);
          // eslint-disable-next-line no-continue
          continue;
        }
        data.data.created_by = username;
        data.data.record_identifier = data.record_identifier;
        const context = { transaction };
        const pusher = getPusherForRecordIdentifier(data.record_identifier);
        // eslint-disable-next-line no-await-in-loop
        await pusher(data, context);
      }
      return true;
    } catch (error) {
      return customErrors(error.name, error.message);
    }
  });

const pullChanges = async (req) => {
  let { lastPulledAt } = req.body;
  lastPulledAt = new Date(lastPulledAt).toISOString();
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
