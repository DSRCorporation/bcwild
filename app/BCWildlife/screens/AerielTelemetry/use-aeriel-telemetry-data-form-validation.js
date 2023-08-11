import {useCallback} from 'react';
import {
  isNumberValueInvalid,
  isStringValueInvalid,
} from '../../shared/utils/form-validation';
import {getFormValidationErrorMessage} from '../../shared/utils/get-form-validation-error-message';
import {Alert} from 'react-native';
import {aerielTelemetryFormLabels} from '../../constants/aeriel-telemetry/aeriel-telemetry-labels';

export const useAerielTelemetryDataFormValidation = () => {
  const validate = useCallback(form => {
    const formProperties = Object.keys(form);

    const invalidProperties = formProperties.filter(name => {
      switch (name) {
        case 'locationId':
        case 'date':
        case 'pilot':
        case 'navigator':
        case 'observer':
        case 'gpsID':
        case 'animal':
        case 'frequency':
        case 'aspect':
        case 'mesoSlope':
        case 'macroPosition':
        case 'habitatType':
          return isStringValueInvalid(form[name]);
        case 'gpsCoordinates':
          const {lat, long} = form[name];
          return isStringValueInvalid(lat) || isStringValueInvalid(long);
        case 'easing':
        case 'northing':
          return isNumberValueInvalid(form[name]);
      }
    });

    const firstProp = invalidProperties[0];

    if (firstProp) {
      const errorMessage = getFormValidationErrorMessage(
        aerielTelemetryFormLabels[firstProp] || firstProp,
      );
      Alert.alert(errorMessage);
    }
    return invalidProperties.length === 0;
  }, []);

  return {validate};
};
