import React, {useCallback, useState} from 'react';
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
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {parseAerialTelemetryForm} from './parseAerialTelemetryForm';
import {getUsernameG} from '../../global';
import RecordsRepo from '../../utility/RecordsRepo';
import {RecordType} from '../../utility/RecordType';
import {useLocation} from '../Location';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {latLonToUtm10, utm10ToLatLon} from '../../shared/utils/convertCoords';
import uuid from 'react-native-uuid';

const ArielTelemetryDataFormScreen = ({navigation}) => {
  const styles = useFormScreenStyles();
  const cardStyles = useCardListStyles();
  const now = new Date();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useImmer({
    locationId: uuid.v4(),
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
    canopyCover: '',
    aspect: null,
    mesoSlope: null,
    macroPosition: null,
    photos: [],
    comments: '',
  });
  const {animals} = useAnimals();
  const {requestLocationPermission, getLocation, showPermissionRequiredAlert} =
    useLocation();
  const currentDateTime = form.date;

  const submit = useCallback(async () => {
    const timestamp = Date.now();
    const parsed = parseAerialTelemetryForm(form, timestamp);
    if (parsed.isValid) {
      const {dto} = parsed;
      const strvalue = JSON.stringify(dto);
      const timeNowEpoch = Math.round(timestamp / 1000);
      const username = getUsernameG();
      const recordIdentifier = `${RecordType.AerialTelemetry}_${username}_${timeNowEpoch}`;
      await RecordsRepo.addRecord(recordIdentifier, strvalue);
      Alert.alert('Success', 'Aerial telemetry saved locally', [
        {
          title: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert('Error', parsed.errorMessage);
    }
  }, [form, navigation]);

  const getCurrentLocation = useCallback(async () => {
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      setLoading(true);
      const {lat, lon} = await getLocation();
      const {easting, northing} = latLonToUtm10(lat, lon);
      setForm(draft => {
        draft.latitude = lat;
        draft.longitude = lon;
        draft.easting = easting ?? '';
        draft.northing = northing ?? '';
      });
      setLoading(false);
    } else {
      showPermissionRequiredAlert();
    }
  }, [
    requestLocationPermission,
    getLocation,
    setForm,
    setLoading,
    showPermissionRequiredAlert,
  ]);

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <SimpleScreenHeader>Aerial Telemetry data</SimpleScreenHeader>
          <View>
            <View>
              <View style={styles.inputContainer}>
                <InputLabel>{aerielTelemetryFormLabels.locationId}</InputLabel>
                <TextInput
                  value={form.locationId}
                  editable={false}
                  placeholder="Enter location ID"
                  style={{...styles.textInput, opacity: 0.5}}
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
                        draft.date = newDate;
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
                        draft.date = newDate;
                      })
                    }
                  />
                </View>
              </View>
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
                <Text style={cardStyles.cardName}>Aerial GPS Coordinates</Text>
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
                  <View style={{flexDirection: 'row', gap: 8, opacity: 0.5}}>
                    <View style={{flex: 1}}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="Longitude"
                        editable={false}
                        value={form.longitude.toString()}
                        style={styles.textInput}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="Latitude"
                        editable={false}
                        value={form.latitude.toString()}
                        style={[styles.textInput, {flex: 2}]}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <InputLabel>
                    {aerielTelemetryFormLabels.gpsCoordinatesUtm}
                  </InputLabel>
                  <View style={{flexDirection: 'row', gap: 8}}>
                    <View style={{flex: 1}}>
                      <TextInput
                        value={form.easting?.toString() ?? ''}
                        keyboardType="numeric"
                        onChangeText={newValue => {
                          const value = newValue.replaceAll(',', '.');
                          const {lat, lon} = utm10ToLatLon(
                            value,
                            form.northing,
                          );
                          setForm(draft => {
                            draft.easting = value;
                            draft.latitude = lat ?? '';
                            draft.longitude = lon ?? '';
                          });
                        }}
                        placeholder="Enter easting"
                        style={styles.textInput}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <TextInput
                        value={form.northing?.toString() ?? ''}
                        keyboardType="numeric"
                        onChangeText={newValue => {
                          const value = newValue.replaceAll(',', '.');
                          const {lat, lon} = utm10ToLatLon(form.easting, value);
                          setForm(draft => {
                            draft.northing = value;
                            draft.latitude = lat ?? '';
                            draft.longitude = lon ?? '';
                          });
                        }}
                        placeholder="Enter northing"
                        style={styles.textInput}
                      />
                    </View>
                  </View>
                </View>
                <BaseButton
                  onPress={getCurrentLocation}
                  style={styles.button}
                  accessibilityLabel="get current location"
                  testID="getCurrentLocation">
                  <Text style={styles.buttonText}>Get current location</Text>
                </BaseButton>
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
                <InputLabel>{aerielTelemetryFormLabels.canopyCover}</InputLabel>
                <TextInput
                  value={form.canopyCover}
                  onChangeText={value =>
                    setForm(draft => {
                      draft.canopyCover = value;
                    })
                  }
                  placeholder="Enter canopy cover (%)"
                  style={styles.textInput}
                  keyboardType="numeric"
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
                <InputLabel>
                  {aerielTelemetryFormLabels.macroPosition}
                </InputLabel>
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
      <LoadingOverlay loading={loading} />
    </View>
  );
};

export default ArielTelemetryDataFormScreen;
