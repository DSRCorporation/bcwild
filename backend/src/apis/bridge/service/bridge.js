const { BridgeConfiguration } = require("../../../model/BridgeConfiguration");
const { sequelize } = require("../../../config/database");
const {
  bridgeConfigurationToDtoProperties,
} = require("../../sync/service/syncBridges");

const bridgeConfigurationToDto = (configuration) => {
  const dto = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [configurationProperty, dtoProperty] of Object.entries(
    bridgeConfigurationToDtoProperties,
  )) {
    const { property, transformToDto } = dtoProperty;
    const value =
      transformToDto == null
        ? configuration[configurationProperty]
        : transformToDto(configuration[configurationProperty]);
    dto[property] = value;
  }
  return dto;
};

const findLatestConfigurations = async () =>
  BridgeConfiguration.findAll({
    attributes: [sequelize.literal('DISTINCT ON ("bridgeId") *')],
    order: [
      ["bridgeId", "ASC"],
      ["time", "DESC"],
    ],
    raw: true,
  });

const listBridges = async () => {
  const configurations = await findLatestConfigurations();
  const bridges = configurations.map(bridgeConfigurationToDto);
  console.log("lb", bridges);
  return { bridges };
};

module.exports = {
  listBridges,
};
