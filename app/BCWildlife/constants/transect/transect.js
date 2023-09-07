import datasheetTypes from './Transect.json';

const pascalCaseToCamelCase = string => {
  if (string === '') {
    return string;
  }
  return string[0].toLowerCase().concat(string.slice(1));
};

const createTransectConstants = ({typeNameToProperty}) => {
  const constants = {};
  const defaults = {};
  datasheetTypes.types.forEach(({name, values}) => {
    const property = typeNameToProperty(name);
    constants[property] = values;
    defaults[property] = values[0].id;
  });
  return [constants, defaults];
};

export const [transectConstants, transectDefaults] = createTransectConstants({
  typeNameToProperty: pascalCaseToCamelCase,
});

export const snowTrackSurveyType = 1;
export const scatSurveyType = 2;
