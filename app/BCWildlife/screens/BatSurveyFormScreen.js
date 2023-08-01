import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import LoadingOverlay from '../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useImmer} from 'use-immer';
import {InputLabel} from '../shared/components/InputLabel';
import {BCWildLogo} from '../shared/components/BCWildLogo';
import {TitleText} from '../shared/components/TitleText';
import {yesOrNoOptions} from '../constants/yes-or-no-options';
import {useBatSurveyFormValidation} from '../shared/hooks/use-bat-survey-form-validation';
import {batSurveyFormLabels} from '../constants/bat-survey/bat-survey-labels';
import {transformListDataToCheckboxItems} from '../shared/utils/form-data';
import {
  batSignData,
  batSignLocationData,
  countingBatsURL,
  guanoAmountData,
  guanoBatSignId,
  guanoCollectedData,
  swallowNestTypeData,
} from '../constants/bat-survey/bat-survey-data';

const BatSurveyFormScreen = () => {
  const [loading, setLoading] = useState(false);
  const {validate} = useBatSurveyFormValidation();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 25,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
    },
    textInput: {
      backgroundColor: '#EFEFEF',
      padding: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    inputContainer: {
      marginBottom: 8,
    },
    button: {
      backgroundColor: '#234075',
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 20,
      padding: 10,
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      textAlign: 'center',
    },
  });

  const [form, setForm] = useImmer({
    // Bat survey results
    batSign: [...transformListDataToCheckboxItems(batSignData)], // checkboxes, multiselect, no selection means None
    locationBatSign: [...transformListDataToCheckboxItems(batSignLocationData)], // checkboxes. If checked, "What" text field appears. Only shows if previous field is not None
    guanoAmountInBiggestPile: [
      ...transformListDataToCheckboxItems(guanoAmountData),
    ], // Only shows if Guano Bat sign is checked
    guanoIs: '', // Only shows if Guano Bat sign is checked
    guanoCollected: [...transformListDataToCheckboxItems(guanoCollectedData)], //checkboxes, multiselect, no selection means None. Only shows if Guano Bat sign is checked.
    guanoSampleLabel: '',
    roostAssessmentNight: '',
    roostAssessmentDay: '',
    maternity: '',
    // Bat count detail
    emergenceCountDone: '', // if yes, show the link https://bcbats.ca/get-involved/counting-bats/
    otherTypeOfCount: '', // separately as checkboxes, multiselect, no selection means None
    // Swallow observations
    nests: '',
    nestType: [...transformListDataToCheckboxItems(swallowNestTypeData)], // checkboxes, multiselect, no selection means None. Only shows if Nests is Yes
    swallowsFlying: '',
    speciesOtherComments: '',
    photos: [],
    couldThisSiteBeSafelyOrEasilyNetted: '',
    wouldRoostingBatsBeReachableWithoutLadder: '',
    comments: '',
  });

  const isGuanoBatSignSelected = useMemo(() => {
    const guanoCheckboxItem = form.batSign.find(
      item => item.value === guanoBatSignId,
    );
    if (!guanoCheckboxItem) {
      return false;
    }
    return guanoCheckboxItem.checked;
  }, [form.batSign]);

  const isAnyBatSignSelected = useMemo(
    () => form.batSign.some(item => item.checked),
    [form.batSign],
  );

  const isEmergencyCountDoneSelected = useMemo(
    () => form.emergenceCountDone === 'yes',
    [form.emergenceCountDone],
  );

  const submit = useCallback(() => {
    const isValid = validate(form);
  }, [validate, form]);

  const setDefaultValues = useCallback(() => {
    setForm(draft => {
      draft.guanoSampleLabel = 'C';
      draft.emergenceCountDone = 'no';
      draft.nests = 'no';
      draft.swallowsFlying = 'no';
      draft.couldThisSiteBeSafelyOrEasilyNetted = 'no';
      draft.wouldRoostingBatsBeReachableWithoutLadder = 'no';
    });
  }, [setForm]);

  useEffect(() => {
    setDefaultValues();
  }, [setDefaultValues]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <BCWildLogo />
        <TitleText>Bat survey</TitleText>
        <View>
          <View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.batSign}</InputLabel>
              {form.batSign.map((option, optionIndex) => (
                <BouncyCheckbox
                  key={option.label}
                  onPress={value => {
                    setForm(draft => {
                      draft.batSign[optionIndex].checked = value;
                    });
                  }}
                  isChecked={option.checked}
                  text={option.label}
                  textStyle={{textDecorationLine: 'none'}}
                  style={{marginBottom: 8}}
                />
              ))}
            </View>
            {isAnyBatSignSelected && (
              <View style={styles.inputContainer}>
                <InputLabel>{batSurveyFormLabels.locationBatSign}</InputLabel>
                {form.locationBatSign.map((option, optionIndex) => (
                  <View key={option.label}>
                    <BouncyCheckbox
                      onPress={value => {
                        setForm(draft => {
                          draft.locationBatSign[optionIndex].checked = value;
                        });
                      }}
                      isChecked={option.checked}
                      text={option.label}
                      textStyle={{textDecorationLine: 'none'}}
                      style={{marginBottom: 8}}
                    />
                    {option.checked && (
                      <TextInput
                        value={option.what}
                        onChangeText={text =>
                          setForm(draft => {
                            draft.locationBatSign[optionIndex].what = text;
                          })
                        }
                        placeholder="Enter text"
                        style={[styles.textInput, {marginBottom: 8}]}
                      />
                    )}
                  </View>
                ))}
              </View>
            )}

            {isGuanoBatSignSelected && (
              <>
                <View style={styles.inputContainer}>
                  <InputLabel>
                    {batSurveyFormLabels.guanoAmountInBiggestPile}
                  </InputLabel>
                  {form.guanoAmountInBiggestPile.map((option, optionIndex) => (
                    <BouncyCheckbox
                      key={option.label}
                      onPress={value => {
                        setForm(draft => {
                          draft.guanoAmountInBiggestPile[optionIndex].checked =
                            value;
                        });
                      }}
                      isChecked={option.checked}
                      text={option.label}
                      textStyle={{textDecorationLine: 'none'}}
                      style={{marginBottom: 8}}
                    />
                  ))}
                </View>
                <View style={styles.inputContainer}>
                  <InputLabel>{batSurveyFormLabels.guanoCollected}</InputLabel>
                  {form.guanoCollected.map((option, optionIndex) => (
                    <BouncyCheckbox
                      key={option.label}
                      onPress={value => {
                        setForm(draft => {
                          draft.guanoCollected[optionIndex].checked = value;
                        });
                      }}
                      isChecked={option.checked}
                      text={option.label}
                      textStyle={{textDecorationLine: 'none'}}
                      style={{marginBottom: 8}}
                    />
                  ))}
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.guanoSampleLabel}</InputLabel>
              <TextInput
                value={form.guanoSampleLabel}
                onChangeText={text =>
                  setForm(draft => {
                    draft.guanoSampleLabel = text;
                  })
                }
                placeholder="Enter guanoSampleLabel"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.emergenceCountDone}</InputLabel>
              <Picker
                selectedValue={form.emergenceCountDone}
                onValueChange={value =>
                  setForm(draft => {
                    draft.emergenceCountDone = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {yesOrNoOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              {isEmergencyCountDoneSelected && (
                <Text
                  onPress={() => Linking.openURL(countingBatsURL)}
                  style={{color: '#216de8', paddingVertical: 8}}>
                  https://bcbats.ca/get-involved/counting-bats/
                </Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.nests}</InputLabel>
              <Picker
                selectedValue={form.nests}
                onValueChange={value =>
                  setForm(draft => {
                    draft.nests = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {yesOrNoOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            {form.nests === 'yes' && (
              <View style={styles.inputContainer}>
                <InputLabel>{batSurveyFormLabels.nestType}</InputLabel>
                {form.nestType.map((option, optionIndex) => (
                  <BouncyCheckbox
                    key={option.label}
                    onPress={value => {
                      setForm(draft => {
                        draft.batSign[optionIndex].checked = value;
                      });
                    }}
                    isChecked={option.checked}
                    text={option.label}
                    textStyle={{textDecorationLine: 'none'}}
                    style={{marginBottom: 8}}
                  />
                ))}
              </View>
            )}
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.swallowsFlying}</InputLabel>
              <Picker
                selectedValue={form.swallowsFlying}
                onValueChange={value =>
                  setForm(draft => {
                    draft.swallowsFlying = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {yesOrNoOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>
                {batSurveyFormLabels.couldThisSiteBeSafelyOrEasilyNetted}
              </InputLabel>
              <Picker
                selectedValue={form.couldThisSiteBeSafelyOrEasilyNetted}
                onValueChange={value =>
                  setForm(draft => {
                    draft.couldThisSiteBeSafelyOrEasilyNetted = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {yesOrNoOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>
                {batSurveyFormLabels.wouldRoostingBatsBeReachableWithoutLadder}
              </InputLabel>
              <Picker
                selectedValue={form.wouldRoostingBatsBeReachableWithoutLadder}
                onValueChange={value =>
                  setForm(draft => {
                    draft.wouldRoostingBatsBeReachableWithoutLadder = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {yesOrNoOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.comments}</InputLabel>
              <TextInput
                value={form.comments}
                onChangeText={text =>
                  setForm(draft => {
                    draft.comments = text;
                  })
                }
                multiline={true}
                placeholder="Enter Comments"
                style={styles.textInput}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={submit}
            style={styles.button}
            accessibilityLabel="create bat survey button"
            testID="createBatSurveyButton">
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingOverlay loading={loading} />
    </ScrollView>
  );
};

export default BatSurveyFormScreen;
