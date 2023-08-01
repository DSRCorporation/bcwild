import {useCallback} from 'react';
import {Alert} from 'react-native';
import {getFormValidationErrorMessage} from '../utils/get-form-validation-error-message';
import {bridgeFormLabels} from '../../constants/bridge-form';

const isStringValueInvalid = value => Boolean(!value);
const isNumberValueInvalid = value => value === '' || value < 0;

export const useBridgeFormValidation = () => {
  const validate = useCallback(form => {
    const formProperties = Object.keys(form);

    const invalidProperties = formProperties.filter(name => {
      switch (name) {
        case 'region':
        case 'bridgeName':
        case 'roadOrHighway':
        case 'motBridgeId':
        case 'bridgeType':
        case 'spanMaterial':
        case 'abutmentOrBackWall':
        case 'underdeck':
        case 'beams':
        case 'columns':
        case 'heightFromBeamsOrDeckToSurfaceBelow':
        case 'length':
        case 'bridgeIfFor':
        case 'crossingType':
        case 'waterCurrentlyUnderBridge':
        case 'habitatAroundBridge':
          return isStringValueInvalid(form[name]);
        case 'coordinates':
          return isNumberValueInvalid(form[name]);
        case 'waterIs':
          if (form.waterCurrentlyUnderBridge === 'no') {
            break;
          }
          return isStringValueInvalid(form[name]);
      }
    });

    const firstProp = invalidProperties[0];

    if (firstProp) {
      const errorMessage = getFormValidationErrorMessage(
        bridgeFormLabels[firstProp] || firstProp,
      );
      Alert.alert(errorMessage);
    }
    return invalidProperties.length === 0;
  }, []);
  return {validate};
};
