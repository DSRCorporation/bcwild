import {useCallback} from 'react';
import {isStringValueInvalid} from '../../shared/utils/form-validation';
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
        case 'observer':
        case 'animal':
        case 'aspect':
        case 'mesoSlope':
        case 'macroPosition':
          return isStringValueInvalid(form[name]);
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
