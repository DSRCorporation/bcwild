import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LoadingOverlay from '../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useImmer} from 'use-immer';
import {InputLabel} from '../shared/components/InputLabel';
import {BCWildLogo} from '../shared/components/BCWildLogo';
import {TitleText} from '../shared/components/TitleText';

const batSurveyFormLabels = {
  batSign: 'Bat sign',
  locationBatSign: 'Location of bat sign',
  GuanoAmountInBiggestPile: 'Guano amount in biggest pile',
  guanoIs: 'Guano is',
  guanoCollected: 'Guano collected',
  guanoSampleLabel: 'Guano sample label',
  roostAssessmentNight: 'Roost assessment - Night',
  roostAssessmentDay: 'Roost assessment - Day',
  maternity: 'Maternity',
  emergenceCountDone: 'Emergence count done',
  otherTypeOfCount: 'Other (acoutstic, etc), other type of count',
  nests: 'Nests',
  nestType: 'Nest type',
  swallowsFlying: 'Swallows flying',
  speciesOtherComments: 'Species, other comments',
  photos: 'Photos',
  couldThisSiteBeSafelyOrEasilyNetted:
    'Could this site be safely/easily netted?',
  wouldRoostingBatsBeReachableWithoutLadder:
    'Would roosting bats be reachable without a ladder?',
  comments: 'Comments',
};

const yesOrNoOptions = [
  {label: 'Yes', value: 'yes'},
  {label: 'No', value: 'no'},
];

const BatSurveyFormScreen = () => {
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
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
    batSign: [
      {label: 'BatSign1', checked: false},
      {label: 'BatSign2', checked: false},
      {label: 'BatSign3', checked: false},
    ], // checkboxes, multiselect, no selection means None
    locationBatSign: [
      {label: 'locationBatSign1', checked: false, what: ''},
      {label: 'locationBatSign2', checked: false, what: ''},
      {label: 'locationBatSign3', checked: false, what: ''},
    ], // checkboxes. If checked, "What" text field appears. Only shows if previous field is not None
    GuanoAmountInBiggestPile: '', // Only shows if Guano Bat sign is checked
    guanoIs: '', // Only shows if Guano Bat sign is checked
    guanoCollected: [
      {label: 'guanoCollected1', checked: false},
      {label: 'guanoCollected2', checked: false},
      {label: 'guanoCollected3', checked: false},
    ], //checkboxes, multiselect, no selection means None. Only shows if Guano Bat sign is checked.
    guanoSampleLabel: 'C',
    roostAssessmentNight: '',
    roostAssessmentDay: '',
    maternity: '',
    // Bat count detail
    emergenceCountDone: 'no', // if yes, show the link https://bcbats.ca/get-involved/counting-bats/
    otherTypeOfCount: '', // separately as checkboxes, multiselect, no selection means None
    // Swallow observations
    nests: 'no',
    nestType: [
      {label: 'nestType1', checked: false},
      {label: 'nestType2', checked: false},
      {label: 'nestType3', checked: false},
    ], // checkboxes, multiselect, no selection means None. Only shows if Nests is Yes
    swallowsFlying: 'no',
    speciesOtherComments: '',
    photos: [],
    couldThisSiteBeSafelyOrEasilyNetted: 'no',
    wouldRoostingBatsBeReachableWithoutLadder: 'no',
    comments: '',
  });

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
