const { DataTypes } = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/Transect.json");
const { addAutoPopulateHook } = require("./addAutoPopulateHook");

function pascalCaseToCamelCase(string) {
  return Array.from(string.matchAll("[A-Z]([a-z]*)"))
    .map((match) => match[0].toLowerCase())
    .join("_");
}

function typeNameToModelName(typeName) {
  return `tr_def_${pascalCaseToCamelCase(typeName)}`;
}

function idColumnType(typeDescription) {
  const { stringId, stringIdLength } = typeDescription;
  let type = DataTypes.INTEGER;
  if (stringId) {
    if (stringIdLength != null) {
      type = DataTypes.STRING(stringIdLength);
    }
    type = DataTypes.STRING;
  }
  return type;
}

function defineModel(typeName) {
  const typeDescription = datasheetTypes.types.find(
    ({ name }) => name === typeName,
  );
  const model = db.sequelize.define(
    typeNameToModelName(typeName),
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: idColumnType(typeDescription),
      },
      value: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );
  addAutoPopulateHook(model, datasheetTypes, typeName);
  return model;
}

function defineModels() {
  const typeNames = datasheetTypes.types.map(({ name }) => name);
  const models = {};
  typeNames.forEach((typeName) => {
    const model = defineModel(typeName);
    models[typeName] = model;
  });
  const modelFor = (typeName) => {
    const model = models[typeName];
    if (model == null) {
      throw new Error(`Unknown transect type ${typeNames}`);
    }
    return model;
  };
  return modelFor;
}

const modelFor = defineModels();

const TrDefSurveyType = modelFor("SurveyType");
const TrDefPrecipitation = modelFor("Precipitation");
const TrDefCloudCover = modelFor("CloudCover");
const TrDefWind = modelFor("Wind");
// const TrDefTemperature = modelFor("Temperature");
const TrDefReliability = modelFor("Reliability");

module.exports = {
  TrDefSurveyType,
  TrDefPrecipitation,
  TrDefCloudCover,
  TrDefWind,
  // TrDefTemperature,
  TrDefReliability,
};
