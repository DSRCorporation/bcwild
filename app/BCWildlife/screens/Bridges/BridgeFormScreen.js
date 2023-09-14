import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { View, TextInput, Alert, Text } from "react-native";
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {InputLabel} from '../../shared/components/InputLabel';
import {
  useBridgeFormValidation,
  bridgeDtoToFormData,
} from './use-bridge-form-validation';
import {
  abutmentData,
  beamsData,
  bridgeIsForData,
  bridgeTypeData,
  columnsData,
  crossingTypeData,
  habitatData,
  regionData,
  spanMaterialData,
  underdeckData,
  waterIsData,
} from '../../constants/bridges/bridge-data';
import {useImmer} from 'use-immer';
import {getUsernameG} from '../../global';
import RecordsRepo from '../../utility/RecordsRepo';
import {BridgeDto, BridgeValidationError} from './use-bridge-form-validation';
import {useBridges} from '../../shared/hooks/use-bridges/useBridges';
import {useFormScreenStyles} from '../../shared/styles/use-form-screen-styles';
import {BaseButton} from '../../shared/components/BaseButton';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {RecordType} from '../../utility/RecordType';
import {useLocation} from '../Location';
import LoadingOverlay from '../../utility/LoadingOverlay';

const BridgeFormScreen = ({route}) => {
  const styles = useFormScreenStyles();
  const currentBridge = (route.params && route.params.bridge) || null;
  const {validate} = useBridgeFormValidation();
  const [loading, setLoading] = useState(false);
  const {requestLocationPermission, getLocation, showPermissionRequiredAlert} =
    useLocation();

  const [form, setForm] = useImmer({
    region: '',
    bridgeName: '',
    longitude: '',
    latitude: '',
    roadOrHighway: '',
    motBridgeId: '',
    bridgeType: '',
    spanMaterial: '',
    abutmentOrBackWall: '',
    underdeck: '',
    beams: '',
    columns: '',
    heightFromBeamsOrDeckToSurfaceBelow: '',
    length: '',
    bridgeIfFor: [],
    crossingType: '',
    waterCurrentlyUnderBridge: 'no',
    waterIs: '',
    habitatAroundBridge: '',
    habitatComments: '',
  });

  const {updateBridgeLocally} = useBridges();

  const submit = useCallback(async () => {
    const timestamp = Date.now();
    const dto = validate(form, timestamp);
    if (dto instanceof BridgeDto) {
      dto.timestamp = timestamp;
      const strvalue = JSON.stringify(dto);
      const timeNowEpoch = Math.round(timestamp / 1000);
      const username = getUsernameG();
      const recordIdentifier = `${RecordType.Bridge}_${username}_${timeNowEpoch}`;
      try {
        const unsyncedRecords = JSON.parse(
          await RecordsRepo.getUnsyncedRecords(),
        );
        const existingRecords = unsyncedRecords.filter(
          item => item.data.motBridgeId === dto.motBridgeId,
        );
        if (existingRecords[0]) {
          await RecordsRepo.deleteRecord(existingRecords[0].record_identifier);
        }
      } catch {
        // error removing existing record, unsynced records array is probably empty
      }
      await RecordsRepo.addRecord(recordIdentifier, strvalue);
      await updateBridgeLocally(dto);
      Alert.alert('Bridge data saved');
    }
    if (dto instanceof BridgeValidationError) {
      Alert.alert(dto.message);
    }
  }, [validate, form, updateBridgeLocally]);

  const getCurrentLocation = useCallback(async () => {
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      setLoading(true);
      const {northing, easting} = await getLocation();
      setForm(draft => {
        draft.latitude = northing;
        draft.longitude = easting;
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

  const actionText = useMemo(
    () => (currentBridge ? 'Edit' : 'Create'),
    [currentBridge],
  );
  const isCreating = currentBridge == null;

  const setDefaultValues = useCallback(() => {
    setForm(draft => {
      draft.region = regionData[0].id;
      draft.bridgeType = bridgeTypeData[0].id;
      draft.spanMaterial = spanMaterialData[0].id;
      draft.abutmentOrBackWall = abutmentData[0].id;
      draft.beams = beamsData[2].id;
      draft.underdeck = underdeckData[0].id;
      draft.columns = columnsData[0].id;
      draft.bridgeIfFor = [];
      draft.crossingType = crossingTypeData[1].id;
      draft.habitatAroundBridge = habitatData[0].id;
    });
  }, [setForm]);

  const setCurrentBridgeValues = useCallback(() => {
    const formData = bridgeDtoToFormData(currentBridge);
    setForm(formData);
  }, [setForm, currentBridge]);

  const setFormValues = useCallback(
    () => (currentBridge ? setCurrentBridgeValues() : setDefaultValues()),
    [currentBridge, setCurrentBridgeValues, setDefaultValues],
  );

  useEffect(() => {
    setFormValues();
  }, [currentBridge, setDefaultValues, setFormValues]);

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <SimpleScreenHeader>{actionText} bridge</SimpleScreenHeader>
          <View>
            <View>
              <View style={styles.inputContainer}>
                <InputLabel>Region</InputLabel>
                <Picker
                  selectedValue={form.region}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.region = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {regionData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Bridge name</InputLabel>
                <TextInput
                  value={form.bridgeName}
                  onChangeText={value =>
                    setForm(draft => {
                      draft.bridgeName = value;
                    })
                  }
                  placeholder="Enter Bridge name"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Coordinates long/lat</InputLabel>
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
                      value={form.longitude.toString()}
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
                      value={form.latitude.toString()}
                      style={[styles.textInput, {flex: 2}]}
                    />
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
                <InputLabel>Road/Highway</InputLabel>
                <TextInput
                  value={form.roadOrHighway}
                  onChangeText={value =>
                    setForm(draft => {
                      draft.roadOrHighway = value;
                    })
                  }
                  placeholder="Enter Road/Highway"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>MOT Bridge ID</InputLabel>
                <TextInput
                  value={form.motBridgeId}
                  editable={isCreating}
                  onChangeText={value =>
                    setForm(draft => {
                      draft.motBridgeId = value;
                    })
                  }
                  placeholder="Enter MOT Bridge ID"
                  style={styles.textInput}
                />
              </View>
            </View>
            <View>
              <View style={styles.inputContainer}>
                <InputLabel>Bridge type</InputLabel>
                <Picker
                  selectedValue={form.bridgeType}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.bridgeType = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {bridgeTypeData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Span material</InputLabel>
                <Picker
                  selectedValue={form.spanMaterial}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.spanMaterial = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {spanMaterialData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Abutment/Back wall</InputLabel>
                <Picker
                  selectedValue={form.abutmentOrBackWall}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.abutmentOrBackWall = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {abutmentData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Underdeck</InputLabel>
                <Picker
                  selectedValue={form.underdeck}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.underdeck = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {underdeckData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Beams</InputLabel>
                <Picker
                  selectedValue={form.beams}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.beams = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {beamsData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Columns</InputLabel>
                <Picker
                  selectedValue={form.columns}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.columns = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {columnsData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Height from beams/deck to surface below</InputLabel>
                <TextInput
                  value={form.heightFromBeamsOrDeckToSurfaceBelow}
                  onChangeText={text =>
                    setForm(draft => {
                      draft.heightFromBeamsOrDeckToSurfaceBelow = text;
                    })
                  }
                  keyboardType="numeric"
                  placeholder="Enter height/deck"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Length (from MOTI or estimate)</InputLabel>
                <TextInput
                  value={form.length}
                  onChangeText={text =>
                    setForm(draft => {
                      draft.length = text;
                    })
                  }
                  keyboardType="numeric"
                  placeholder="Enter length"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Bridge is for</InputLabel>
                {bridgeIsForData.map(item => (
                  <BouncyCheckbox
                    key={item.id}
                    onPress={() => {
                    setForm(draft => {
                      if (draft.bridgeIfFor.includes(item.id)) {
                        draft.bridgeIfFor = draft.bridgeIfFor.filter(
                          id => id !== item.id,
                          );
                        } else {
                          draft.bridgeIfFor = [...draft.bridgeIfFor, item.id];
                        }
                      });
                    }}
                    isChecked={form.bridgeIfFor.includes(item.id)}
                    text={item.value}
                    // eslint-disable-next-line react-native/no-inline-styles
                    textStyle={{textDecorationLine: 'none'}}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{marginBottom: 8}}
                    disableBuiltInState
                  />
                ))}
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Crossing type</InputLabel>
                <Picker
                  selectedValue={form.crossingType}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.crossingType = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {crossingTypeData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Habitat around bridge</InputLabel>
                <Picker
                  selectedValue={form.habitatAroundBridge}
                  onValueChange={value =>
                    setForm(draft => {
                      draft.habitatAroundBridge = value;
                    })
                  }>
                  <Picker.Item label="Select" value={null} />
                  {habitatData.map(item => (
                    <Picker.Item
                      key={item.id}
                      label={item.value}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <InputLabel>Habitat Comments</InputLabel>
                <TextInput
                  value={form.habitatComments}
                  onChangeText={value =>
                    setForm(draft => {
                      draft.habitatComments = value;
                    })
                  }
                  multiline={true}
                  placeholder="Enter Habitat Comments"
                  style={styles.textInput}
                />
              </View>
            </View>
            <BaseButton
              onPress={submit}
              accessibilityLabel="create bridge button"
              testID="createNewBridgeButton">
              {actionText}
            </BaseButton>
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay loading={loading} />
    </View>
  );
};

export default BridgeFormScreen;
