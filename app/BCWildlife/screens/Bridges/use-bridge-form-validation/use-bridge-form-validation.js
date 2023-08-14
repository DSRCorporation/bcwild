import {useCallback} from 'react';
import {getFormValidationErrorMessage} from '../../utils/get-form-validation-error-message';
import {bridgeFormLabels} from '../../../constants/bridges/bridge-labels';
import {BridgeValidationError} from './BridgeValidationError';
import {BridgeDto} from './BridgeDto';

const parseStringValue = (data, prop) => {
  const value = data[prop];
  if (!value) {
    throw new BridgeValidationError(prop);
  }
  return value;
};
const parseFloatValue = (data, prop) => {
  const stringValue = data[prop];
  const value = parseFloat(stringValue);
  if (Number.isNaN(value)) {
    throw new BridgeValidationError(prop);
  }
  return value;
};
const parseNumberDefaultZero = (data, prop) => {
  const value = data[prop];
  if (value == null) {
    return 0;
  }
  if (typeof value !== 'number') {
    throw new BridgeValidationError(prop);
  }
  return value;
};

const simpleParsing = [
  {
    parse: parseStringValue,
    fieldDictionary: {
      bridgeName: 'bridgeName',
      motBridgeId: 'bridgeMotId',
      region: 'regionId',
      roadOrHighway: 'roadName',
      bridgeType: 'bridgeType',
      spanMaterial: 'spanMaterial',
      abutmentOrBackWall: 'abutment',
      underdeck: 'underdeck',
      beams: 'beams',
      columns: 'columns',
      crossingType: 'crossingType',
      habitatAroundBridge: 'habitat',
    },
  },
  {
    parse: parseFloatValue,
    fieldDictionary: {
      heightFromBeamsOrDeckToSurfaceBelow: 'height',
      length: 'length',
    },
  },
];

const bridgeFormToDto = (form, {timestamp}) => {
  const dto = new BridgeDto();
  console.log("form", JSON.stringify(form));
  dto.timestamp = timestamp;
  dto.bridgeId = parseNumberDefaultZero(form, 'bridgeId');
  simpleParsing.forEach(({parse, fieldDictionary}) => {
    for (const [formProperty, dtoProperty] of Object.entries(fieldDictionary)) {
      dto[dtoProperty] = parse(form, formProperty);
    }
  });
  // FIXME must be multiselect
  dto.bridgeFor = [parseStringValue(form, 'bridgeIfFor')];
  dto.habitatComments = form.habitatComment;
  return dto;
};

const validate = (form, options) => {
  try {
    return bridgeFormToDto(form, options);
  } catch (err) {
    if (err instanceof BridgeValidationError) {
      const prop = err.message;
      const errorMessage = getFormValidationErrorMessage(
        bridgeFormLabels[prop] || prop,
      );
      return new BridgeValidationError(errorMessage);
    } else {
      throw err;
    }
  }
};

export const useBridgeFormValidation = () => {
  return {validate};
};
