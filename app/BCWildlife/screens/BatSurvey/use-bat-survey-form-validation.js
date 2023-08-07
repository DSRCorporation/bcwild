import {useCallback} from 'react';
import {getFormValidationErrorMessage} from '../../shared/utils/get-form-validation-error-message';
import {Alert} from 'react-native';
import {batSurveyFormLabels} from '../../constants/bat-survey/bat-survey-labels';
import {
  isCheckboxesValueInvalid,
  isStringValueInvalid,
} from '../../shared/utils/form-validation';

export const useBatSurveyFormValidation = () => {
  const validate = useCallback(
    (form, {isGuanoBatSignSelected, isNestsSelected}) => {
      const formProperties = Object.keys(form);

      const invalidProperties = formProperties.filter(name => {
        switch (name) {
          case 'emergenceCountDone':
          case 'couldThisSiteBeSafelyOrEasilyNetted':
          case 'swallowsFlying':
          case 'nests':
          case 'wouldRoostingBatsBeReachableWithoutLadder':
          case 'roostAssessmentDay':
          case 'roostAssessmentNight':
            return isStringValueInvalid(form[name]);
          case 'nestType':
            if (!isNestsSelected) {
              break;
            }
            return isCheckboxesValueInvalid(form[name]);
          case 'batSign':
          case 'locationBatSign':
          case 'otherTypeOfCount':
            return isCheckboxesValueInvalid(form[name]);
          case 'guanoAmountInBiggestPile':
          case 'guanoSampleLabel':
          case 'guanoDistribution':
            if (!isGuanoBatSignSelected) {
              break;
            }
            return isStringValueInvalid(form[name]);
          case 'guanoCollected':
            if (!isGuanoBatSignSelected) {
              break;
            }
            return isCheckboxesValueInvalid(form[name]);
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
    },
    [],
  );

  return {validate};
};
