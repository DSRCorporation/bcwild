import {
  applyPropertyTransforms,
  datePropertyToTimestamp,
  ensureNonemptyStringProperty,
  ensureNonnegativeNumberProperty,
  parseFloatProperty,
  parseNonnegativeFloatProperty,
} from '../../shared/utils/form-validation';
import {getFormValidationErrorMessage} from '../../shared/utils/get-form-validation-error-message';
import {aerielTelemetryFormLabels} from '../../constants/aeriel-telemetry/aeriel-telemetry-labels';

const dtoProperties = [
  {
    property: 'locationId',
    transform: ensureNonemptyStringProperty,
  },
  {
    property: 'pilot',
    transform: ensureNonemptyStringProperty,
  },
  {
    property: 'navigator',
    transform: ensureNonemptyStringProperty,
  },
  {
    property: 'observer',
    transform: ensureNonemptyStringProperty,
  },
  {
    property: 'gpsID',
    transform: ensureNonemptyStringProperty,
  },
  {
    property: 'waypoint',
  },
  {
    property: 'latitude',
    transform: parseFloatProperty,
  },
  {
    property: 'longitude',
    transform: parseFloatProperty,
  },
  {
    property: 'easting',
    transform: parseFloatProperty,
  },
  {
    property: 'northing',
    transform: parseFloatProperty,
  },
  {
    property: 'animal',
    transform: ensureNonemptyStringProperty,
  },
  {
    property: 'frequency',
    transform: parseNonnegativeFloatProperty,
  },
  {
    property: 'aspect',
    transform: ensureNonnegativeNumberProperty,
  },
  {
    property: 'mesoSlope',
    transform: ensureNonnegativeNumberProperty,
  },
  {
    property: 'macroPosition',
    transform: ensureNonnegativeNumberProperty,
  },
  {
    fromProperty: 'timeOfLocation',
    toProperty: 'locationTimestamp',
    transform: datePropertyToTimestamp,
  },
  {
    property: 'habitatType',
    transform: ensureNonemptyStringProperty,
  },
  {
    property: 'comments',
  },
];

const aerialTelemetryFormParser = applyPropertyTransforms(dtoProperties);

export const parseAerialTelemetryForm = (form, timestamp) => {
  const parsed = aerialTelemetryFormParser(form);
  if (parsed.ok) {
    const dto = parsed.value;
    dto.timestamp = timestamp;
    return {isValid: true, dto};
  }
  const failedProperty = parsed.errorMessage;
  const errorMessage = getFormValidationErrorMessage(
    aerielTelemetryFormLabels[failedProperty] || failedProperty,
  );
  return {isValid: false, errorMessage};
};
