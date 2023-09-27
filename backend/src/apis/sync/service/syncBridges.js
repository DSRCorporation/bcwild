const { Bridge } = require("../../../model/Bridge");
const { BridgeConfiguration } = require("../../../model/BridgeConfiguration");

const toPowersOfTwo = (int) => {
  let power = 1;
  const result = [];
  let num = int;
  while (num > 0) {
    if (num % 2 !== 0) {
      result.push(power);
    }
    // eslint-disable-next-line no-bitwise
    num >>= 1;
    // eslint-disable-next-line no-bitwise
    power <<= 1;
  }
  return result;
};

// TODO move this to bridge helpers
// This stuff is also used elsewhere.
const bridgeConfigurationToDtoProperties = {
  name: { property: "bridgeName" },
  roadName: { property: "roadName" },
  motBridgeID: { property: "bridgeMotId" },
  easting: { property: "easting" },
  northing: { property: "northing" },
  longitude: { property: "longitude" },
  latitude: { property: "latitude" },
  height: { property: "height" },
  length: { property: "length" },
  habitatComments: { property: "habitatComments" },
  bridgeForMask: {
    property: "bridgeFor",
    // eslint-disable-next-line no-bitwise
    transform: (masks) => masks.reduce((acc, val) => acc | val, 0),
    transformToDto: toPowersOfTwo,
  },
  habitatId: { property: "habitat" },
  regionId: { property: "regionId" },
  typeId: { property: "bridgeType" },
  spanMaterialId: { property: "spanMaterial" },
  abutmentId: { property: "abutment" },
  underdeckId: { property: "underdeck" },
  beamsId: { property: "beams" },
  columnsId: { property: "columns" },
  crossingTypeId: { property: "crossingType" },
  createdBy: { property: "created_by" },
  time: {
    property: "timestamp",
    transform: (timestamp) => new Date(timestamp),
    transformToDto: (time) => time.getTime(),
  },
};

const bridgeDtoToConfiguration = (bridgeId, dto) => {
  const configuration = { bridgeId };
  // eslint-disable-next-line no-restricted-syntax
  for (const [configurationProperty, dtoProperty] of Object.entries(
    bridgeConfigurationToDtoProperties,
  )) {
    const { property, transform } = dtoProperty;
    const value = transform == null ? dto[property] : transform(dto[property]);
    configuration[configurationProperty] = value;
  }
  return configuration;
};

const syncBridges = async (data, { transaction }) => {
  const dto = data.data;
  const { bridgeMotId } = dto;
  let bridgeId;
  const bridgeConfiguration = await BridgeConfiguration.findOne(
    { where: { motBridgeID: bridgeMotId } },
    { transaction },
  );
  if (bridgeConfiguration != null) {
    bridgeId = bridgeConfiguration.bridgeId;
  } else {
    const bridge = await Bridge.create({}, { transaction });
    bridgeId = bridge.id;
  }
  const cfg = bridgeDtoToConfiguration(bridgeId, dto);
  await BridgeConfiguration.create(cfg, { transaction });
};

module.exports = {
  syncBridges,
  bridgeConfigurationToDtoProperties,
};
