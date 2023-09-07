const { customCreate } = require("../sequelizeQuery/sync");
const Telemetry = require("../models/telemetry");
const CameraTrapData = require("../models/camera");
const { syncBridges } = require("./syncBridges");
const { syncAnimals } = require("./syncAnimals");
const { syncAerialTelemetry } = require("./syncAerialTelemetry");
const { syncBats } = require("./syncBats");
const { syncTransect } = require("./syncTransect");

const pushChangesUpdatingModel =
  (model) =>
  async (data, { transaction }) =>
    customCreate(
      model,
      data.data,
      { transaction },
      { record_identifier: data.record_identifier },
    );

const pushers = {
  TELE: pushChangesUpdatingModel(Telemetry),
  CAM: pushChangesUpdatingModel(CameraTrapData),
  BRIDGE: syncBridges,
  BAT: syncBats,
  ANIMAL: syncAnimals,
  AERIALTELEMETRY: syncAerialTelemetry,
  TRANSECT: syncTransect,
};

module.exports = {
  pushers,
};
