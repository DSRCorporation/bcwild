const { sequelize } = require("../../../config/database");
const { Animal } = require("../../../model/Animal");
const { AtData } = require("../../../model/AtData");

const observationToDtoProperties = {
  time: {
    property: "timestamp",
    transform: (timestamp) => new Date(timestamp),
  },
  locationId: { property: "locationId" },
  easting: { property: "easting" },
  northing: { property: "northing" },
  latitude: { property: "latitude" },
  longitude: { property: "longitude" },
  frequency: { property: "frequency" },
  gpsID: { property: "gpsID" },
  habitatType: { property: "habitatType" },
  locationTime: {
    property: "locationTimestamp",
    transform: (timestamp) => timestamp && new Date(timestamp),
  },
  navigator: { property: "navigator" },
  observer: { property: "observer" },
  pilot: { property: "pilot" },
  waypoint: { property: "waypoint" },
  aspectId: { property: "aspect" },
  mesoSlopeId: { property: "mesoSlope" },
  macroPositionId: { property: "macroPosition" },
  createdBy: { property: "created_by" },
  comments: { property: "comments" },
  userDateTime: {
    property: "date",
    transform: (timestamp) => new Date(timestamp),
  },
};

const dtoToObservation = (dto, { animalId }) => {
  const observation = { animalId };
  // eslint-disable-next-line no-restricted-syntax
  for (const [observationProperty, dtoProperty] of Object.entries(
    observationToDtoProperties,
  )) {
    const { property, transform } = dtoProperty;
    let value;
    if (transform != null) {
      value = transform(dto[property]);
    } else {
      value = dto[property];
    }
    observation[observationProperty] = value;
  }
  return observation;
};

const syncAerialTelemetry = async (data) =>
  sequelize.transaction(async (transaction) => {
    const dto = data.data;
    // DTO is supposed to have string animal ID, not the internal animal ID.
    // Find the internal animal ID.
    const stringAnimalId = dto.animal;
    if (!stringAnimalId) {
      throw Error("Empty animal ID");
    }
    const animal = await Animal.findOne(
      { where: { stringId: stringAnimalId } },
      { transaction },
    );
    if (!animal) {
      throw Error(
        `Animal with ID ${stringAnimalId} does not exist in the database`,
      );
    }
    // Populate main table
    await AtData.create(dtoToObservation(dto, { animalId: animal.id }));
  });

module.exports = {
  syncAerialTelemetry,
};
