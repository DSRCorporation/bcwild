const { Bridge } = require("../../../model/Bridge");
const { sequelize } = require("../../../config/database");
const { BridgeConfiguration } = require("../../../model/BridgeConfiguration");
const { BridgeObservation } = require("../../../model/BridgeObservation");
const {
  BBDataBatSignStandardLocation,
} = require("../../../model/BBDataBatSignStandardLocation");
const {
  BBDataBatSignCustomLocation,
} = require("../../../model/BBDataBatSignCustomLocation");
const { BBDataBatSign } = require("../../../model/BBDataBatSigns");
const {BBDataPhotos} = require("../../../model/BBDataPhotos");

// eslint-disable-next-line no-bitwise
const arrayToBitmask = (masks) => masks.reduce((acc, val) => acc | val, 0);

const noWater = 1; // from BatsAndBridges.json

const bridgeObservationToDtoProperties = {
  emergenceBatCountDone: { property: "emergenceCountDone" },
  batRecordingsMask: {
    property: "batRecordings",
    // eslint-disable-next-line no-bitwise
    transform: (masks) => masks.reduce((acc, val) => acc | val, 0),
  },
  swallowNestTypeMask: {
    property: "swallowNestTypes",
    transform: arrayToBitmask,
  },
  swallowsFlying: { property: "swallowsFlying" },
  comments: { property: "comments" },
  speciesComments: { property: "speciesComments" },
  roostNightAssessment: { property: "roostAssessmentNight" },
  roostDayAssessment: { property: "roostAssessmentDay" },
  maternityAssessment: { property: "maternity" },
  batGuanoAmount: { property: "guanoAmount" },
  batGuanoDistribution: { property: "guanoDistribution" },
  batGuanoCollectedMask: {
    property: "guanoCollected",
    transform: arrayToBitmask,
  },
  batGuanoSampleLabel: { property: "guanoSampleLabel" },
  createdBy: { property: "created_by" },
  time: {
    property: "timestamp",
    transform: (timestamp) => new Date(timestamp),
    transformToDto: (time) => time.getTime(),
  },
  observers: { property: "observers" },
  water: {
    dtoFunction: (dto) => {
      if (dto.waterUnderBridge) {
        return dto.water;
      }
      return noWater;
    },
  },
  couldThisSiteBeSafelyOrEasilyNetted: { property: "couldBeSafelyNetted" },
  wouldRoostingBatsBeReachableWithoutLadder: {
    property: "wouldBatsBeReachable",
  },
  photos: { property: "photos" },
};

const batDtoToObservation = (bridgeId, dto) => {
  const observation = { bridgeId };
  // eslint-disable-next-line no-restricted-syntax
  for (const [observationProperty, dtoProperty] of Object.entries(
    bridgeObservationToDtoProperties,
  )) {
    const { property, transform, dtoFunction } = dtoProperty;
    let value;
    if (dtoFunction != null) {
      value = dtoFunction(dto);
    } else if (transform != null) {
      value = transform(dto[property]);
    } else {
      value = dto[property];
    }
    observation[observationProperty] = value;
  }
  return observation;
};

const batDtoBatSignToTable = (observationId) => (batSign) => {
  const { batSignId, batSignPresent } = batSign;
  return {
    bridgeObservation: observationId,
    batSign: batSignId,
    isPresent: batSignPresent,
  };
};

const batDtoBatSignLocationToTable = (observationId) => (batSignLocation) => {
  const {
    batSignLocationId,
    batSignLocationHasSigns,
    batSignLocationDescription,
  } = batSignLocation;
  return {
    bridgeObservation: observationId,
    signLocation: batSignLocationId,
    hasSigns: batSignLocationHasSigns,
    description: batSignLocationDescription,
  };
};

const batDtoBatCustomSignLocationToTable =
  (observationId) => (batSignLocation) => {
    const { location, description } = batSignLocation;
    return {
      bridgeObservation: observationId,
      location,
      description,
    };
  };

const batDtoPhotosToTable = (observationId) => (photo) => ({
  bridgeObservationId: observationId,
  image: photo,
});

const syncBats = async (data) =>
  sequelize.transaction(async (transaction) => {
    // Sync the tables
    await Promise.all(
      [
        Bridge,
        BridgeConfiguration,
        BridgeObservation,
        BBDataBatSign,
        BBDataBatSignStandardLocation,
        BBDataBatSignCustomLocation,
      ].map((model) => model.sync({ transaction })),
    );
    const dto = data.data;
    // DTO is supposed to have MOT ID, not the internal bridge ID.
    // Find the internal bridge ID.
    const { bridgeMotId } = dto;
    if (!bridgeMotId) {
      throw Error("Empty bridge MOT ID");
    }
    const bridgeConfiguration = await BridgeConfiguration.findOne(
      { where: { motBridgeID: bridgeMotId } },
      { transaction },
    );
    if (!bridgeConfiguration) {
      throw Error(
        `Bridge with MOT ID ${bridgeMotId} does not exist in the database`,
      );
    }
    const { bridgeId } = bridgeConfiguration;
    // Populate main observation table
    const bridgeObservation = await BridgeObservation.create(
      batDtoToObservation(bridgeId, dto),
      { transaction },
    );
    const observationId = bridgeObservation.id;
    // Now that we have the observation ID, populate bat signs data and photos.
    const batSigns = dto.batSigns.map(batDtoBatSignToTable(observationId));
    const signLocations = dto.batSignLocations.map(
      batDtoBatSignLocationToTable(observationId),
    );
    const customSignLocations = dto.batSignCustomLocations.map(
      batDtoBatCustomSignLocationToTable(observationId),
    );
    const photos = dto.photos.map(batDtoPhotosToTable(observationId));
    const signAndPhotoCreation = signLocations
      .map((loc) => BBDataBatSignStandardLocation.create(loc, { transaction }))
      .concat(
        customSignLocations.map((loc) =>
          BBDataBatSignCustomLocation.create(loc, { transaction }),
        ),
        batSigns.map((sign) => BBDataBatSign.create(sign, { transaction })),
      )
      .concat(
        photos.map((photo) => BBDataPhotos.create(photo, { transaction })),
      );
    await Promise.all(signAndPhotoCreation);
  });

module.exports = {
  syncBats,
};
