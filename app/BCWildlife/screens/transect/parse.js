import {ValidationError} from '../../shared/utils/form-validation';
import {encounterConfig, standConfig, transectConfig} from './config';

const parseStringValue = (propertyName, value, optional) => {
  if (!optional && value === '') {
    throw new ValidationError(['missing', propertyName]);
  }
  return value;
};

const parseIntValue = (propertyName, value, optional) => {
  if (value == null && value === '') {
    if (optional) {
      return null;
    } else {
      throw new ValidationError(['missing', propertyName]);
    }
  }
  const numValue = parseInt(value, 10);
  if (Number.isNaN(numValue)) {
    throw new ValidationError(['invalid', propertyName]);
  }
  return numValue;
};

const parseFloatValue = (propertyName, value, optional) => {
  if (value === '') {
    if (optional) {
      return null;
    } else {
      throw new ValidationError(['missing', propertyName]);
    }
  }
  const numValue = parseFloat(value);
  if (Number.isNaN(numValue)) {
    throw new ValidationError(['invalid', propertyName]);
  }
  return numValue;
};

const parseDateValue = (propertyName, value, optional) => {
  if (value === '') {
    if (optional) {
      return null;
    } else {
      throw new ValidationError(['missing', propertyName]);
    }
  }
  const dateValue = new Date(value);
  const timestamp = dateValue.getTime();
  if (Number.isNaN(timestamp)) {
    throw new ValidationError(['invalid', propertyName]);
  }
  return timestamp;
};

const parseDefault = (propertyName, value, optional) => {
  if (!value) {
    if (optional) {
      return null;
    } else {
      throw new ValidationError(['missing', propertyName]);
    }
  }
  return value;
};

const parsers = {
  string: parseStringValue,
  int: parseIntValue,
  float: parseFloatValue,
  date: parseDateValue,
};

const parseInputValue = (form, inputConfig) => {
  const {name, type, optional} = inputConfig;
  const parse = parsers[type] || parseDefault;
  const formValue = form[name];
  if (formValue == null) {
    throw new ValidationError(['missing', name]);
  }
  return parse(name, formValue, optional);
};

export const parseForm = (form, formConfig) => {
  const dto = {};
  formConfig.inputs.forEach(inputConfig => {
    const {databaseFieldName} = inputConfig;
    // type === undefined means the element does not provide a form field
    const {type} = inputConfig;
    if (type !== undefined) {
      dto[databaseFieldName] = parseInputValue(form, inputConfig);
    }
  });
  return dto;
};

const missingErrorMessage = (error, config) => {
  const name = error.message[1];
  const inputConfig = config.inputs.find(input => input.name === name);
  const {displayName} = inputConfig;
  return `${displayName} is missing`;
};

const invalidErrorMessage = (error, config) => {
  const name = error.message[1];
  const inputConfig = config.inputs.find(input => input.name === name);
  const {displayName} = inputConfig;
  return `${displayName} is invalid`;
};

const errorMessageByType = {
  missing: missingErrorMessage,
  invalid: invalidErrorMessage,
};

export const errorMessage = (error, config) => {
  const errorType = error.message[0];
  const errorMessageFn = errorMessageByType[errorType];
  if (errorMessage == null) {
    // Should not happen if the config is OK
    throw Error(`Unknown error type ${errorType}`);
  }
  return errorMessageFn(error, config);
};

export const parseEncounter = form => parseForm(form, encounterConfig);

export const parseStand = form => {
  const dto = parseForm(form, standConfig);
  dto.encounters = form.encounters.map(parseEncounter);
  return dto;
};

export const parseTransect = form => {
  const dto = parseForm(form, transectConfig);
  dto.stands = form.stands.map(parseStand);
  return dto;
};
