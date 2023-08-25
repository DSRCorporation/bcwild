import {BCWildLogo} from '../../shared/components/BCWildLogo';
import {TitleText} from '../../shared/components/TitleText';
import React, {useCallback} from 'react';
import {InputLabel} from '../../shared/components/InputLabel';
import {Alert, View, ScrollView, Text, TextInput} from 'react-native';
import {DateTimePicker} from '../../shared/components/DateTimePicker';
import {useImmer} from 'use-immer';
import {useAnimals} from '../Animals/use-animals';
import {Picker} from '@react-native-picker/picker';
import {GalleryPicker} from '../../shared/components/GalleryPicker';
import {BaseButton} from '../../shared/components/BaseButton';
import {useFormScreenStyles} from '../../shared/styles/use-form-screen-styles';
import {aerielTelemetryFormLabels} from '../../constants/aeriel-telemetry/aeriel-telemetry-labels';
import {
  aspectData,
  macroPositionData,
  mesoSlopeData,
} from '../../constants/aeriel-telemetry/aeriel-telemetry-data';
import {useCardListStyles} from '../../shared/styles/card-list-styles';
import {parseAerialTelemetryForm} from './parseAerialTelemetryForm';
import {getUsernameG} from '../../global';
import RecordsRepo from '../../utility/RecordsRepo';

const ArielTelemetryDataFormScreen = ({navigation}) => {
  const styles = useFormScreenStyles();
  const cardStyles = useCardListStyles();
  const now = new Date();
  const [form, setForm] = useImmer({
    locationId: '',
    pilot: '',
    navigator: '',
    date: now,
    observer: '',
    gpsID: '',
    waypoint: '',
    latitude: '',
    longitude: '',
    easting: '',
    northing: '',
    animal: null,
    frequency: '',
    timeOfLocation: now,
    habitatType: '',
    aspect: null,
    mesoSlope: null,
    macroPosition: null,
    photos: [],
    comments: '',
  });
  const {animals} = useAnimals();

  const submit = useCallback(async () => {
    const timestamp = Date.now();
    const parsed = parseAerialTelemetryForm(form, timestamp);
    if (parsed.isValid) {
      const {dto} = parsed;
      const strvalue = JSON.stringify(dto);
      const timeNowEpoch = Math.round(timestamp / 1000);
      const username = getUsernameG();
      const recordIdentifier = `AERIALTELEMETRY_${username}_${timeNowEpoch}`;
      await RecordsRepo.addRecord(recordIdentifier, strvalue);
      Alert.alert('Success', 'Aerial telemetry saved locally');
      navigation.goBack();
    } else {
      Alert.alert('Error', parsed.errorMessage);
    }
  }, [form, navigation]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <BCWildLogo />
        <TitleText>Aerial Telemetry data</TitleText>
        <View>
          <View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.locationId}</InputLabel>
              <TextInput
                value={form.locationId}
                onChangeText={value =>
                  setForm(draft => {
                    draft.locationId = value;
                  })
                }
                placeholder="Enter location ID"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.pilot}</InputLabel>
              <TextInput
                value={form.pilot}
                onChangeText={value =>
                  setForm(draft => {
                    draft.pilot = value;
                  })
                }
                placeholder="Enter pilot"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.navigator}</InputLabel>
              <TextInput
                value={form.navigator}
                onChangeText={value =>
                  setForm(draft => {
                    draft.navigator = value;
                  })
                }
                placeholder="Enter navigator"
                style={styles.textInput}
              />
            </View>
            {/* Automatic?
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.date}</InputLabel>
              <DateTimePicker
                value={form.date}
                onChange={date =>
                  setForm(draft => {
                    draft.date = date;
                  })
                }
              />
            </View>
            */}
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.observer}</InputLabel>
              <TextInput
                value={form.observer}
                onChangeText={value =>
                  setForm(draft => {
                    draft.observer = value;
                  })
                }
                placeholder="Enter observer"
                style={styles.textInput}
              />
            </View>
            <View style={cardStyles.card}>
              <Text style={cardStyles.cardName}>
                Aerial GPS Coordinates (NAD83 only)
              </Text>
              <View style={styles.inputContainer}>
                <InputLabel>{aerielTelemetryFormLabels.gpsID}</InputLabel>
                <TextInput
                  value={form.gpsID}
                  onChangeText={value =>
                    setForm(draft => {
                      draft.gpsID = value;
                    })
                  }
                  placeholder="Enter GPS ID"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>
                  {aerielTelemetryFormLabels.waypoint} (optional){' '}
                </InputLabel>
                <TextInput
                  value={form.waypoint}
                  onChangeText={value =>
                    setForm(draft => {
                      draft.waypoint = value;
                    })
                  }
                  placeholder="Enter waypoint"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>
                  {aerielTelemetryFormLabels.gpsCoordinates}
                </InputLabel>
                <View style={{flexDirection: 'row', gap: 8}}>
                  <View style={{flex: 1}}>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Enter longitude"
                      onChangeText={value =>
                        setForm(draft => {
                          draft.longitude = value;
                        })
                      }
                      value={form.longitude}
                      style={styles.textInput}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Enter latitude"
                      onChangeText={value =>
                        setForm(draft => {
                          draft.latitude = value;
                        })
                      }
                      value={form.latitude}
                      style={[styles.textInput, {flex: 2}]}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>{aerielTelemetryFormLabels.easting}</InputLabel>
                <TextInput
                  value={form.easting}
                  keyboardType="numeric"
                  onChangeText={value =>
                    setForm(draft => {
                      draft.easting = value;
                    })
                  }
                  placeholder="Enter easting"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>{aerielTelemetryFormLabels.northing}</InputLabel>
                <TextInput
                  value={form.northing}
                  keyboardType="numeric"
                  onChangeText={value =>
                    setForm(draft => {
                      draft.northing = value;
                    })
                  }
                  placeholder="Enter northing"
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.animal}</InputLabel>
              <Picker
                selectedValue={form.animal}
                onValueChange={value =>
                  setForm(draft => {
                    draft.animal = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {animals.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.frequency}</InputLabel>
              <TextInput
                keyboardType="numeric"
                value={form.frequency}
                onChangeText={value =>
                  setForm(draft => {
                    draft.frequency = value;
                  })
                }
                placeholder="Enter frequency"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>
                {aerielTelemetryFormLabels.timeOfLocation}
              </InputLabel>
              <DateTimePicker
                value={form.timeOfLocation}
                mode="time"
                onChange={date =>
                  setForm(draft => {
                    draft.timeOfLocation = date;
                  })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.habitatType}</InputLabel>
              <TextInput
                value={form.habitatType}
                onChangeText={value =>
                  setForm(draft => {
                    draft.habitatType = value;
                  })
                }
                placeholder="Enter habitat type"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.aspect}</InputLabel>
              <Picker
                selectedValue={form.aspect}
                onValueChange={value =>
                  setForm(draft => {
                    draft.aspect = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {aspectData.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.value}
                    value={option.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.mesoSlope}</InputLabel>
              <Picker
                selectedValue={form.mesoSlope}
                onValueChange={value =>
                  setForm(draft => {
                    draft.mesoSlope = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {mesoSlopeData.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.value}
                    value={option.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.macroPosition}</InputLabel>
              <Picker
                selectedValue={form.macroPosition}
                onValueChange={value =>
                  setForm(draft => {
                    draft.macroPosition = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {macroPositionData.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.value}
                    value={option.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <GalleryPicker
                onChange={photos =>
                  setForm(draft => {
                    draft.photos = photos;
                  })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Comments</InputLabel>
              <TextInput
                value={form.comments}
                onChangeText={value =>
                  setForm(draft => {
                    draft.comments = value;
                  })
                }
                multiline={true}
                placeholder="Enter comments"
                style={styles.textInput}
              />
            </View>
          </View>
          <BaseButton
            onPress={submit}
            style={styles.button}
            accessibilityLabel="create aerial telemetry data button"
            testID="createAerialTelemetryDataButton">
            <Text style={styles.buttonText}>Create</Text>
          </BaseButton>
        </View>
      </View>
    </ScrollView>
  );
};

export default ArielTelemetryDataFormScreen;
