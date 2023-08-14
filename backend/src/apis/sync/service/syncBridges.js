const { Bridge } = require("../../../model/Bridge");
const { sequelize } = require("../../../config/database");
const { BridgeConfiguration } = require("../../../model/BridgeConfiguration");

const bridgeConfigurationToDtoProperties = {
  name: { property: "bridgeName" },
  roadName: { property: "roadName" },
  motBridgeID: { property: "bridgeMotId" },
  longitude: { property: "longitude" },
  latitude: { property: "latitude" },
  height: { property: "height" },
  length: { property: "length" },
  habitatComments: { property: "habitatComments" },
  bridgeForMask: {
    property: "bridgeFor",
    // eslint-disable-next-line no-bitwise
    transform: (masks) => masks.reduce((acc, val) => acc | val, 0),
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

const syncBridges = async (data) =>
  sequelize.transaction(async (transaction) => {
    console.log("transaction", transaction);
    // const data = {
    //   record_identifier: "BRIDGE__1691514274",
    //   data: {
    //     bridgeId: 0,
    //     timestamp: 1691583698076,
    //     bridgeName: "Ddd",
    //     bridgeMotId: "Mot",
    //     regionId: 1,
    //     roadName: "Rd",
    //     bridgeType: 5,
    //     spanMaterial: 1,
    //     abutment: 1,
    //     underdeck: 1,
    //     beams: 3,
    //     columns: 1,
    //     crossingType: 2,
    //     habitat: 1,
    //     height: 2,
    //     length: 3.6,
    //     bridgeFor: [2],
    //     habitatComment: "",
    //     created_by: "dsr-admin",
    //     record_identifier: "BRIDGE__1691514274",
    //   },
    // };
    console.log("syncBridges", data);
    const dto = data.data;
    const { bridgeId } = dto;
    const bridge = bridgeId
      ? await Bridge.findByPk(bridgeId, { transaction })
      : await Bridge.create({}, { transaction });
    console.log("syncBridges bridge", bridge);
    if (bridge == null) {
      throw new Error(
        `Bridge with ID ${bridgeId} does not exist in the database`,
      );
    }
    const cfg = bridgeDtoToConfiguration(bridge.id, dto);
    console.log("cfg", cfg);
    await BridgeConfiguration.create(cfg, { transaction });
    // BridgeConfiguration.create(
    //   {
    //     bridgeId: bridge.id,
    //     name: "Ddd",
    //     roadName: "Rd",
    //     motBridgeID: "Mot",
    //     longitute: 3.3,
    //     latitude: 2.4,
    //     height: 2.0,
    //     habitatComment: "",
    //     bridgeForMask: 2,

    //     habitatId: 1,
    //     regionId: 1,
    //     typeId: 1,
    //     spanMaterial: 1,
    //     abutmentId: 1,
    //     underdeckId: 1,
    //     beamsId: 3,
    //     columnsId: 1,
    //     crossingTypeId: 2,
    //     length: 3.6,
    //   },
    //   transaction,
    // );
  });

module.exports = {
  syncBridges,
};
