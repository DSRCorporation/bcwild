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

const addDataTransform = (pusher, dataTransform) => async (data, options) => {
  const transformedData = dataTransform(data);
  await pusher(transformedData, options);
};

/* eslint-disable node/no-unsupported-features/es-syntax */
const parseTelemetryTriangulations = (data) => {
  let { triangulation } = data.data;
  if (triangulation === "") {
    triangulation = [];
  }
  return {
    ...data,
    data: { ...data.data, triangulation },
  };
};

const pushers = {
  TELE: addDataTransform(
    pushChangesUpdatingModel(Telemetry),
    parseTelemetryTriangulations,
  ),
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
