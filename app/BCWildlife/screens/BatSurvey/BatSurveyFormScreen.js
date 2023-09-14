import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, View, Text, TextInput, Linking} from 'react-native';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useImmer} from 'use-immer';
import {InputLabel} from '../../shared/components/InputLabel';
import {TitleText} from '../../shared/components/TitleText';
import {
  noValue,
  yesOrNoOptions,
  yesValue,
} from '../../constants/yes-or-no-options';
import {batSurveyFormLabels} from '../../constants/bat-survey/bat-survey-labels';
import {transformListDataToCheckboxItems} from '../../shared/utils/form-data';
import {
  assessmentData,
  batSignData,
  batSignLocationData,
  countingBatsURL,
  guanoAmountData,
  guanoBatSignId,
  guanoCollectedData,
  guanoDistributionData,
  recordingData,
  swallowNestTypeData,
} from '../../constants/bat-survey/bat-survey-data';
import {waterIsData} from '../../constants/bridges/bridge-data';
import {GalleryPicker} from '../../shared/components/GalleryPicker';
import {BaseButton} from '../../shared/components/BaseButton';
import {useFormScreenStyles} from '../../shared/styles/use-form-screen-styles';
import {parseBatSurvey} from './parseBatSurvey';
import {getUsernameG} from '../../global';
import RecordsRepo from '../../utility/RecordsRepo';
import {useBridges} from '../../shared/hooks/use-bridges/useBridges';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {RowList} from '../../shared/components/RowList';
import {RecordType} from '../../utility/RecordType';
import {DateTimePicker} from '../../shared/components/DateTimePicker';

const linkColor = '#216de8';

const CustomLocation = ({value, onDelete, onChange}) => {
  const styles = useFormScreenStyles();
  return (
    <View style={styles.inputContainer}>
      <InputLabel>
        Location {value.key} <Text onPress={onDelete}>[Delete]</Text>
      </InputLabel>
      <TextInput
        value={value.location}
        onChangeText={text => onChange({...value, location: text})}
        multiline={true}
        placeholder="Describe the location"
        style={styles.textInput}
      />
      <TextInput
        value={value.description}
        onChangeText={text => onChange({...value, description: text})}
        multiline={true}
        placeholder="Describe the bat signs"
        style={styles.textInput}
      />
    </View>
  );
};

const createCustomLocation = key => ({key, description: '', comments: ''});

const BatSurveyFormScreen = () => {
  const styles = useFormScreenStyles();
  const [needBridges, setNeedBridges] = useState(true);
  const [bridges, setBridges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attachedImages, setAttachedImages] = useState([]);
  const [createDisabled, setCreateDisabled] = useState(false);

  const [form, setForm] = useImmer({
    dateTime: Date.now(),
    observers: '',
    bridgeMotId: '',
    batSign: [...transformListDataToCheckboxItems(batSignData)], // checkboxes, multiselect, no selection means None
    locationBatSign: [...transformListDataToCheckboxItems(batSignLocationData)], // checkboxes. If checked, "What" text field appears. Only shows if previous field is not None
    otherLocations: [],
    guanoAmountInBiggestPile: '', // Only shows if Guano Bat sign is checked
    guanoDistribution: '', // Only shows if Guano Bat sign is checked
    guanoCollected: [...transformListDataToCheckboxItems(guanoCollectedData)], //checkboxes, multiselect, no selection means None. Only shows if Guano Bat sign is checked.
    guanoSampleLabel: '',
    roostAssessmentNight: '',
    roostAssessmentDay: '',
    maternity: '',
    // Bat count detail
    emergenceCountDone: '', // if yes, show the link https://bcbats.ca/get-involved/counting-bats/
    otherTypeOfCount: [...transformListDataToCheckboxItems(recordingData)], // separately as checkboxes, multiselect, no selection means None
    // Swallow observations
    nests: '',
    nestType: [...transformListDataToCheckboxItems(swallowNestTypeData)], // checkboxes, multiselect, no selection means None. Only shows if Nests is Yes
    swallowsFlying: '',
    speciesOtherComments: '',
    photos: [],
    couldThisSiteBeSafelyOrEasilyNetted: '',
    wouldRoostingBatsBeReachableWithoutLadder: '',
    comments: '',
    waterCurrentlyUnderBridge: '',
    waterIs: '',
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
    () => form.emergenceCountDone === yesValue,
    [form.emergenceCountDone],
  );

  const isNestsSelected = useMemo(() => form.nests === yesValue, [form.nests]);

  const currentDateTime = new Date(form.dateTime);

  const submit = useCallback(async () => {
    const timestamp = Date.now();
    const parsed = parseBatSurvey(form, timestamp);
    if (!parsed.isValid) {
      Alert.alert(parsed.errorMessage);
    } else {
      const {dto} = parsed;
      dto.photos = attachedImages;
      const strvalue = JSON.stringify(dto);
      const timeNowEpoch = Math.round(timestamp / 1000);
      const username = getUsernameG();
      const recordIdentifier = `${RecordType.Bat}_${username}_${timeNowEpoch}`;
      await RecordsRepo.addRecord(recordIdentifier, strvalue);
      setCreateDisabled(true);
    }
  }, [form, attachedImages]);

  const setDefaultValues = useCallback(() => {
    setForm(draft => {
      draft.guanoSampleLabel = '';
      draft.emergenceCountDone = noValue;
      draft.nests = noValue;
      draft.swallowsFlying = noValue;
      draft.couldThisSiteBeSafelyOrEasilyNetted = noValue;
      draft.wouldRoostingBatsBeReachableWithoutLadder = noValue;
      draft.roostAssessmentDay = 3;
      draft.roostAssessmentNight = 3;
      draft.maternity = 3;
    });
  }, [setForm]);

  useEffect(() => {
    setDefaultValues();
  }, [setDefaultValues]);

  const {bridgeChoices} = useBridges();

  useEffect(() => {
    const loadBridges = async () => {
      setLoading(true);
      setNeedBridges(false);
      try {
        const loadedBridges = await bridgeChoices();
        setBridges(loadedBridges);
      } finally {
        setLoading(false);
      }
    };
    loadBridges().catch(error => {
      console.error('Cannot load bridge list', error);
      Alert.alert('Error', 'Cannot load bridge list');
    });
  }, [bridgeChoices]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <SimpleScreenHeader>Bat survey</SimpleScreenHeader>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
          }}>
          <View style={styles.inputContainer}>
            <InputLabel>Date</InputLabel>
            <DateTimePicker
              value={currentDateTime}
              mode="date"
              onChange={date =>
                setForm(draft => {
                  const newDate = new Date(currentDateTime);
                  newDate.setFullYear(date.getFullYear());
                  newDate.setMonth(date.getMonth());
                  newDate.setDate(date.getDate());
                  newDate.setSeconds(0, 0);
                  draft.dateTime = newDate.getTime();
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <InputLabel>Time</InputLabel>
            <DateTimePicker
              value={currentDateTime}
              mode="time"
              onChange={date =>
                setForm(draft => {
                  const newDate = new Date(currentDateTime);
                  newDate.setHours(date.getHours());
                  newDate.setMinutes(date.getMinutes());
                  newDate.setSeconds(0, 0);
                  draft.dateTime = newDate.getTime();
                })
              }
            />
          </View>
        </View>
        <View>
          <View style={styles.inputContainer}>
            <InputLabel>{batSurveyFormLabels.observers}</InputLabel>
            <TextInput
              value={form.observers}
              onChangeText={text =>
                setForm(draft => {
                  draft.observers = text;
                })
              }
              multiline={true}
              placeholder="Enter Observers"
              style={styles.textInput}
            />
          </View>
          <View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.bridgeMotId}</InputLabel>
              <Picker
                selectedValue={form.bridgeMotId}
                onValueChange={value =>
                  setForm(draft => {
                    draft.bridgeMotId = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {bridges.map(({bridgeMotId, bridgeName}) => (
                  <Picker.Item
                    key={bridgeMotId}
                    label={`${bridgeMotId} ${bridgeName}`}
                    value={bridgeMotId}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <InputLabel>
              {batSurveyFormLabels.waterCurrentlyUnderBridge}
            </InputLabel>
            <Picker
              selectedValue={form.waterCurrentlyUnderBridge}
              onValueChange={value =>
                setForm(draft => {
                  draft.waterCurrentlyUnderBridge = value;
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
          {form.waterCurrentlyUnderBridge === 'yes' && (
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.waterIs}</InputLabel>
              <Picker
                selectedValue={form.waterIs}
                onValueChange={value =>
                  setForm(draft => {
                    draft.waterIs = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {waterIsData.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.value}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>
          )}
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
              <View>
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
                          // eslint-disable-next-line react-native/no-inline-styles
                          style={[styles.textInput, {marginBottom: 8}]}
                        />
                      )}
                    </View>
                  ))}
                </View>
                <View style={styles.inputContainer}>
                  <InputLabel>Other locations</InputLabel>
                  <RowList
                    createRow={createCustomLocation}
                    Row={CustomLocation}
                    onChange={rows =>
                      setForm(draft => {
                        draft.otherLocations = rows;
                      })
                    }
                    addLabel="Add location"
                  />
                </View>
              </View>
            )}

            {isGuanoBatSignSelected && (
              <>
                <View style={styles.inputContainer}>
                  <InputLabel>
                    {batSurveyFormLabels.guanoAmountInBiggestPile}
                  </InputLabel>
                  <Picker
                    selectedValue={form.guanoAmountInBiggestPile}
                    onValueChange={value =>
                      setForm(draft => {
                        draft.guanoAmountInBiggestPile = value;
                      })
                    }>
                    <Picker.Item label="Select" value={null} />
                    {guanoAmountData.map(item => (
                      <Picker.Item
                        key={item.id}
                        label={item.value}
                        value={item.id}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.inputContainer}>
                  <InputLabel>
                    {batSurveyFormLabels.guanoDistribution}
                  </InputLabel>
                  <Picker
                    selectedValue={form.guanoDistribution}
                    onValueChange={value =>
                      setForm(draft => {
                        draft.guanoDistribution = value;
                      })
                    }>
                    <Picker.Item label="Select" value={null} />
                    {guanoDistributionData.map(item => (
                      <Picker.Item
                        key={item.id}
                        label={item.value}
                        value={item.id}
                      />
                    ))}
                  </Picker>
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
                  <InputLabel>
                    {batSurveyFormLabels.guanoSampleLabel}
                  </InputLabel>
                  <TextInput
                    value={form.guanoSampleLabel}
                    onChangeText={text =>
                      setForm(draft => {
                        draft.guanoSampleLabel = text;
                      })
                    }
                    placeholder="Enter guano sample label"
                    style={styles.textInput}
                  />
                </View>
              </>
            )}
            <View style={styles.inputContainer}>
              <InputLabel>
                {batSurveyFormLabels.roostAssessmentNight}
              </InputLabel>
              <Picker
                selectedValue={form.roostAssessmentNight}
                onValueChange={value =>
                  setForm(draft => {
                    draft.roostAssessmentNight = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {assessmentData.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.value}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.roostAssessmentDay}</InputLabel>
              <Picker
                selectedValue={form.roostAssessmentDay}
                onValueChange={value =>
                  setForm(draft => {
                    draft.roostAssessmentDay = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {assessmentData.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.value}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.maternity}</InputLabel>
              <Picker
                selectedValue={form.maternity}
                onValueChange={value =>
                  setForm(draft => {
                    draft.maternity = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {assessmentData.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.value}
                    value={item.id}
                  />
                ))}
              </Picker>
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
                  style={{color: linkColor, paddingVertical: 8}}>
                  https://bcbats.ca/get-involved/counting-bats/
                </Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{batSurveyFormLabels.otherTypeOfCount}</InputLabel>
              {form.otherTypeOfCount.map((option, optionIndex) => (
                <BouncyCheckbox
                  key={option.label}
                  onPress={value => {
                    setForm(draft => {
                      draft.otherTypeOfCount[optionIndex].checked = value;
                    });
                  }}
                  isChecked={option.checked}
                  text={option.label}
                  textStyle={{textDecorationLine: 'none'}}
                  style={{marginBottom: 8}}
                />
              ))}
            </View>
            <TitleText>Swallow observations</TitleText>
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
            {isNestsSelected && (
              <View style={styles.inputContainer}>
                <InputLabel>{batSurveyFormLabels.nestType}</InputLabel>
                {form.nestType.map((option, optionIndex) => (
                  <BouncyCheckbox
                    key={option.label}
                    onPress={value => {
                      setForm(draft => {
                        draft.nestType[optionIndex].checked = value;
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
                {batSurveyFormLabels.speciesOtherComments}
              </InputLabel>
              <TextInput
                value={form.speciesOtherComments}
                onChangeText={text =>
                  setForm(draft => {
                    draft.speciesOtherComments = text;
                  })
                }
                multiline={true}
                placeholder="Enter Comments"
                style={styles.textInput}
              />
            </View>
            <TitleText>Misc</TitleText>
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
          <View style={styles.inputContainer}>
            <InputLabel>{batSurveyFormLabels.photos}</InputLabel>
            <GalleryPicker
              onChange={setAttachedImages}
              images={attachedImages}
            />
          </View>
          <BaseButton
            disabled={createDisabled}
            onPress={submit}
            accessibilityLabel="create bat survey button"
            testID="createBatSurveyButton">
            Create
          </BaseButton>
        </View>
      </View>
      <LoadingOverlay loading={loading} />
    </ScrollView>
  );
};

export default BatSurveyFormScreen;
