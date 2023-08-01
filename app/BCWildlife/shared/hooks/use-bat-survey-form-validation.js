import {useCallback} from 'react';
import {isStringValueInvalid} from '../utils/form-validation';
import {getFormValidationErrorMessage} from '../utils/get-form-validation-error-message';
import {Alert} from 'react-native';
import {batSurveyFormLabels} from '../../constants/bat-survey/bat-survey-labels';

export const useBatSurveyFormValidation = () => {
  const validate = useCallback(form => {
    const formProperties = Object.keys(form);

    const invalidProperties = formProperties.filter(name => {
      switch (name) {
        case 'emergenceCountDone':
        case 'couldThisSiteBeSafelyOrEasilyNetted':
        case 'swallowsFlying':
        case 'wouldRoostingBatsBeReachableWithoutLadder':
          return isStringValueInvalid(form[name]);
      }
    });

    const firstProp = invalidProperties[0];

    if (firstProp) {
      const errorMessage = getFormValidationErrorMessage(
        batSurveyFormLabels[firstProp] || firstProp,
      );
      Alert.alert(errorMessage);
    }
    return invalidProperties.length === 0;
  }, []);

  return {validate};
};
