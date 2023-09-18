const { syncBridges } = require("./syncBridges");
const { syncAnimals } = require("./syncAnimals");
const { syncAerialTelemetry } = require("./syncAerialTelemetry");
const { syncBats } = require("./syncBats");
const { syncTransect } = require("./syncTransect");
const { syncCameraTrapData } = require("./syncCameraTrapData");
const { syncTelemetry } = require("./syncTelemetry");

const pushers = {
  TELE: syncTelemetry,
  CAM: syncCameraTrapData,
  BRIDGE: syncBridges,
  BAT: syncBats,
  ANIMAL: syncAnimals,
  AERIALTELEMETRY: syncAerialTelemetry,
  TRANSECT: syncTransect,
};

module.exports = {
  pushers,
};
