import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {InputLabel} from '../../shared/components/InputLabel';
import {
  useBridgeFormValidation,
  bridgeDtoToFormData,
} from '../../shared/hooks/use-bridge-form-validation';
import {BCWildLogo} from '../../shared/components/BCWildLogo';
import {TitleText} from '../../shared/components/TitleText';
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
import {yesOrNoOptions} from '../constants/yes-or-no-options';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getUsernameG} from '../../global';
import RecordsRepo from '../../utility/RecordsRepo';
import {BridgeDto} from '../../shared/hooks/use-bridge-form-validation';
import {BridgeValidationError} from '../../shared/hooks/use-bridge-form-validation';
import {useBridges} from '../../shared/hooks/use-bridges/useBridges';
import {useFormScreenStyles} from '../../shared/styles/use-form-screen-styles';
import {BaseButton} from '../../shared/components/BaseButton';

const BridgeFormScreen = ({route, navigation}) => {
  const styles = useFormScreenStyles();
  const currentBridge = (route.params && route.params.bridge) || null;
  const {validate} = useBridgeFormValidation();
  const [loading, setLoading] = useState(false);

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
    bridgeIfFor: '',
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
      const recordIdentifier = `BRIDGE_${username}_${timeNowEpoch}`;
      RecordsRepo.addRecord(recordIdentifier, strvalue);
      await updateBridgeLocally(dto);
      Alert.alert('Bridge data saved');
    }
    if (dto instanceof BridgeValidationError) {
      Alert.alert(dto.message);
    }
  }, [validate, form, updateBridgeLocally]);

  const actionText = useMemo(
    () => (currentBridge ? 'Edit' : 'Create'),
    [currentBridge],
  );

  const setDefaultValues = useCallback(() => {
    setForm(draft => {
      draft.region = regionData[0].id;
      draft.bridgeType = bridgeTypeData[0].id;
      draft.spanMaterial = spanMaterialData[0].id;
      draft.abutmentOrBackWall = abutmentData[0].id;
      draft.beams = beamsData[2].id;
      draft.underdeck = underdeckData[0].id;
      draft.columns = columnsData[0].id;
      draft.bridgeIfFor = bridgeIsForData[1].id;
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

  const navigateToDashboard = async () => {
    const session = await EncryptedStorage.getItem('user_session');
    if (!session) {
      return;
    }
    const obj = JSON.parse(session);
    if (obj.data.role === 'admin') {
      navigation.navigate('Dashboard', {admin: true});
    } else {
      navigation.navigate('Dashboard', {admin: false});
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigateToDashboard()}>
          <Image
            source={require('../../assets/arrow_back_ios.png')}
            style={{height: 25, width: 25, marginTop: 30}}
          />
        </TouchableOpacity>
        <BCWildLogo />
        <TitleText>{actionText} bridge</TitleText>
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
              <Picker
                selectedValue={form.bridgeIfFor}
                onValueChange={value =>
                  setForm(draft => {
                    draft.bridgeIfFor = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {bridgeIsForData.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.value}
                    value={item.id}
                  />
                ))}
              </Picker>
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
            {/*
            TODO: move this to bat observation form
            <View style={styles.inputContainer}>
              <InputLabel>Water currently under bridge</InputLabel>
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
                <InputLabel>Water is</InputLabel>
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
            */}
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
      <LoadingOverlay loading={loading} />
    </ScrollView>
  );
};

export default BridgeFormScreen;
