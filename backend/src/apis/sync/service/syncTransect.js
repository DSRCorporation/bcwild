const { sequelize } = require("../../../config/database");
const { TrDataEncounter } = require("../../../model/TrDataEncounter");
const { TrDataStand } = require("../../../model/TrDataStand");
const { TrDataTransect } = require("../../../model/TrDataTransect");

const dtoToModelData = (config) => {
  const timePropertiesSet = new Set(config && config.timeProperties);
  const dtoToModelProperty = (config && config.dtoToModelProperty) || {};
  return (dto, extraProperties) => {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const modelData = { ...extraProperties };
    // eslint-disable-next-line no-restricted-syntax
    for (const [property, value] of Object.entries(dto)) {
      const modelProperty = dtoToModelProperty[property] || property;
      const modelValue = timePropertiesSet.has(property)
        ? new Date(value)
        : value;
      modelData[modelProperty] = modelValue;
    }
    return modelData;
  };
};

const dtoToTransectData = dtoToModelData({
  timeProperties: ["time", "Date_Time", "Snow_date"],
  dtoToModelProperty: {
    created_by: "createdBy",
  },
});

const dtoToEncounterData = dtoToModelData();

const dtoToStandData = dtoToModelData();

const createTransectRecord = async (dto, transaction) =>
  TrDataTransect.create(dtoToTransectData(dto), { transaction });

const createEncounterRecord = async (
  encounterDto,
  extraProperties,
  transaction,
) =>
  TrDataEncounter.create(dtoToEncounterData(encounterDto, extraProperties), {
    transaction,
  });

// Return a list of encounter data
const createStandRecord = async (standDto, transectId, transaction) => {
  const stand = await TrDataStand.create(
    dtoToStandData(standDto, { transectId }),
    {
      transaction,
    },
  );
  const standId = stand.id;
  return standDto.encounters.map((encounterDto) => ({
    encounterDto,
    extraProperties: {
      standId,
      transectId,
    },
  }));
};

const syncTransect = async (data, { transaction }) => {
  const dto = data.data;
  // Populate main observation table
  const transect = await createTransectRecord(dto, transaction);
  const transectId = transect.id;
  // Populate stand table collecting encounter data
  const encountersPerStand = await Promise.all(
    dto.stands.map((standDto) =>
      createStandRecord(standDto, transectId, transaction),
    ),
  );
  const encounters = encountersPerStand.flat();
  // Populate encounter table
  await Promise.all(
    encounters.map(({ encounterDto, extraProperties }) =>
      createEncounterRecord(encounterDto, extraProperties, transaction),
    ),
  );
};

module.exports = {
  syncTransect,
};
