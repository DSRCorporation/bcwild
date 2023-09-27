import {bridgeFormLabels} from '../../../constants/bridges/bridge-labels';
import {BridgeValidationError} from './BridgeValidationError';
import {BridgeDto} from './BridgeDto';
import {getFormValidationErrorMessage} from '../../../shared/utils/get-form-validation-error-message';

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

const returnAsIs = (data, prop) => data[prop];

const formToDtoRules = [
  {
    form: 'bridgeName',
    dto: 'bridgeName',
    formToDto: parseStringValue,
  },
  {
    form: 'motBridgeId',
    dto: 'bridgeMotId',
    formToDto: parseStringValue,
  },
  {
    form: 'roadOrHighway',
    dto: 'roadName',
    formToDto: parseStringValue,
  },
  {
    form: 'bridgeType',
    dto: 'roadName',
    formToDto: parseStringValue,
  },
];
const simpleParsing = [
  {
    parse: returnAsIs,
    fieldDictionary: {
      timestamp: 'timestamp',
      bridgeIfFor: 'bridgeFor',
      habitatComments: 'habitatComments',
      region: 'regionId',
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
    parse: parseStringValue,
    fieldDictionary: {
      bridgeName: 'bridgeName',
      motBridgeId: 'bridgeMotId',
      roadOrHighway: 'roadName',
    },
  },
  {
    parse: parseFloatValue,
    fieldDictionary: {
      heightFromBeamsOrDeckToSurfaceBelow: 'height',
      length: 'length',
      longitude: 'longitude',
      latitude: 'latitude',
      easting: 'easting',
      northing: 'northing',
    },
  },
];

const bridgeFormToDto = (form, {timestamp}) => {
  const dto = new BridgeDto();
  dto.timestamp = timestamp;
  simpleParsing.forEach(({parse, fieldDictionary}) => {
    for (const [formProperty, dtoProperty] of Object.entries(fieldDictionary)) {
      dto[dtoProperty] = parse(form, formProperty);
    }
  });
  return dto;
};

export const bridgeDtoToFormData = dto => {
  const formData = {};
  simpleParsing.forEach(({parse, fieldDictionary}) => {
    for (const [formProperty, dtoProperty] of Object.entries(fieldDictionary)) {
      if (parse !== parseFloatValue) {
        formData[formProperty] = dto[dtoProperty];
      } else {
        // Numerical values from text fields are converted to strings
        formData[formProperty] = String(dto[dtoProperty]);
      }
    }
  });
  console.log('dto2form', dto, formData);
  return formData;
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
