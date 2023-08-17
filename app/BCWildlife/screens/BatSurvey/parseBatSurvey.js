import {getFormValidationErrorMessage} from '../../shared/utils/get-form-validation-error-message';
import {BatSurveyValidationError} from './BatSurveyValidationError';
import {BatSurveyDto} from './BatSurveyDto';
import {guanoBatSignId} from '../../constants/bat-survey/bat-survey-data';
import {batSurveyFormLabels} from '../../constants/bat-survey/bat-survey-labels';

const ensureNonemptyString = (data, prop) => {
  const value = data[prop];
  if (typeof value === 'string' && value) {
    return value;
  }
  throw new BatSurveyValidationError(prop);
};

const ensureOptionalString = (data, prop) => {
  const value = data[prop];
  if (typeof value === 'string' && value == null) {
    return value;
  }
  throw new BatSurveyValidationError(prop);
};

const ensureNumber = (data, prop) => {
  const value = data[prop];
  if (typeof value === 'number') {
    return value;
  }
  throw new BatSurveyValidationError(prop);
};

const parseYesNo = (data, prop) => {
  const value = data[prop];
  if (value === 'yes' || value === 'Yes') {
    return true;
  }
  if (value === 'no' || value === 'No') {
    return false;
  }
  throw new BatSurveyValidationError(prop);
};

const parseGuanoFieldsWithGuano = (form, dto) => {
  dto.guanoAmount = ensureNumber(form, 'guanoAmountInBiggestPile');
  dto.guanoDistribution = ensureNumber(form, 'guanoDistribution');
  dto.guanoCollected = form.guanoCollected
    .filter(({checked}) => checked)
    .map(({value}) => value);
  if (dto.guanoCollected) {
    dto.guanoSampleLabel = ensureNonemptyString(form, 'guanoSampleLabel');
  } else {
    dto.guanoSampleLabel = ensureOptionalString(form, 'guanoSampleLabel');
  }
};

const parseGuanoFieldsWithoutGuano = (form, dto) => {
  dto.guanoAmount = 1; // NONE
  dto.guanoDistribution = null;
  dto.guanoCollected = [];
  dto.guanoSampleLabel = null;
};

const parseGuanoFields = (form, dto, hasGuano) => {
  const fn = hasGuano
    ? parseGuanoFieldsWithGuano
    : parseGuanoFieldsWithoutGuano;
  fn(form, dto);
};

const formToDto = (form, timestamp) => {
  console.log('form', form);
  const dto = new BatSurveyDto();
  dto.timestamp = timestamp;
  dto.bridgeMotId = ensureNonemptyString(form, 'bridgeMotId');
  dto.waterUnderBridge = parseYesNo(form, 'waterCurrentlyUnderBridge');
  if (dto.waterUnderBridge) {
    dto.water = ensureNumber(form, 'waterIs');
  } else {
    dto.water = null;
  }
  dto.batSigns = form.batSign.map(({value, checked}) => ({
    batSignId: value,
    batSignPresent: checked,
  }));
  dto.batSignLocations = form.locationBatSign.map(({checked, value, what}) => ({
    batSignLocationId: value,
    batSignLocationHasSigns: checked,
    batSignLocationDescription: what,
  }));
  // FIXME: support in the form
  dto.batSignCustomLocations = [];
  const hasGuano = form.batSign.find(
    ({value}) => value === guanoBatSignId,
  ).checked;
  parseGuanoFields(form, dto, hasGuano);
  dto.roostAssessmentDay = ensureNumber(form, 'roostAssessmentDay');
  dto.roostAssessmentNight = ensureNumber(form, 'roostAssessmentNight');
  dto.maternity = ensureNumber(form, 'maternity');
  dto.emergenceCountDone = parseYesNo(form, 'emergenceCountDone');
  dto.batRecordings = form.otherTypeOfCount
    .filter(({checked}) => checked)
    .map(({value}) => value);
  dto.areSwallowNestsPresent = parseYesNo(form, 'nests');
  dto.swallowNestTypes = form.nestType
    .filter(({checked}) => checked)
    .map(({value}) => value);
  if (dto.areSwallowNestsPresent && dto.swallowNestTypes.length === 0) {
    throw new BatSurveyValidationError('nestType');
  }
  dto.swallowsFlying = parseYesNo(form, 'swallowsFlying');
  dto.couldBeSafelyNetted = parseYesNo(
    form,
    'couldThisSiteBeSafelyOrEasilyNetted',
  );
  dto.wouldBatsBeReachable = parseYesNo(
    form,
    'wouldRoostingBatsBeReachableWithoutLadder',
  );
  dto.speciesComments = form.speciesOtherComments;
  dto.comments = form.comments;
  dto.observers = form.observers;
  return dto;
};

export const parseBatSurvey = (form, timestamp) => {
  try {
    const dto = formToDto(form, timestamp);
    return {
      isValid: true,
      dto,
    };
  } catch (error) {
    if (error instanceof BatSurveyValidationError) {
      const invalidProp = error.message;
      const errorMessage = getFormValidationErrorMessage(
        batSurveyFormLabels[invalidProp] || invalidProp,
      );
      return {
        isValid: false,
        errorMessage,
      };
    }
    throw error;
  }
};
