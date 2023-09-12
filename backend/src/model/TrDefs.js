const { DataTypes } = require("sequelize");
const db = require("../config/database");
const datasheetTypes = require("../datasheettypes/Transect.json");

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
  const initModel = async (transaction) => {
    await model.bulkCreate(typeDescription.values, {
      transaction,
      updateOnDuplicate: ["id"],
    });
  };
  return [model, initModel];
}

function defineModels() {
  const typeNames = datasheetTypes.types.map(({ name }) => name);
  const models = {};
  const initFunctions = [];
  typeNames.forEach((typeName) => {
    const [model, initModel] = defineModel(typeName);
    models[typeName] = model;
    initFunctions.push(initModel);
  });
  const modelFor = (typeName) => {
    const model = models[typeName];
    if (model == null) {
      throw new Error(`Unknown transect type ${typeNames}`);
    }
    return model;
  };
  return { modelFor, initFunctions };
}

const { modelFor, initFunctions } = defineModels();

const TrDefSurveyType = modelFor("SurveyType");
const TrDefPrecipitation = modelFor("Precipitation");
const TrDefCloudCover = modelFor("CloudCover");
const TrDefWind = modelFor("Wind");
// const TrDefTemperature = modelFor("Temperature");
const TrDefReliability = modelFor("Reliability");

async function init(transaction) {
  await Promise.all(initFunctions.map((fn) => fn(transaction)));
}

module.exports = {
  TrDefSurveyType,
  TrDefPrecipitation,
  TrDefCloudCover,
  TrDefWind,
  // TrDefTemperature,
  TrDefReliability,
  init,
};
