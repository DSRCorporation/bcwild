import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {InputLabel} from '../shared/components/InputLabel';
import {useBridgeFormValidation} from '../shared/hooks/use-bridge-form-validation';
import {BCWildLogo} from '../shared/components/BCWildLogo';
import {TitleText} from '../shared/components/TitleText';
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
} from '../constants/bridges/bridge-data';
import {useImmer} from 'use-immer';
import {yesOrNoOptions} from '../constants/yes-or-no-options';

const BridgeFormScreen = ({route}) => {
  const currentBridgeId = (route.params && route.params.bridgeId) || null;
  const {validate} = useBridgeFormValidation();
  const [loading, setLoading] = useState(false);
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
    region: '',
    bridgeName: '',
    coordinates: {
      long: '',
      lat: '',
    },
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

  const submit = useCallback(() => {
    const isValid = validate(form);
  }, [validate, form]);

  const actionText = useMemo(
    () => (currentBridgeId ? 'Edit' : 'Create'),
    [currentBridgeId],
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

  useEffect(() => {
    if (!currentBridgeId) {
      setDefaultValues();
    }
  }, [currentBridgeId, setDefaultValues]);

  return (
    <ScrollView>
      <View style={styles.container}>
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
                        draft.coordinates.long = value;
                      })
                    }
                    value={form.coordinates.long}
                    style={styles.textInput}
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Enter latitude"
                    onChangeText={value =>
                      setForm(draft => {
                        draft.coordinates.lat = value;
                      })
                    }
                    value={form.coordinates.lat}
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
          <TouchableOpacity
            style={styles.button}
            onPress={submit}
            accessibilityLabel="create bridge button"
            testID="createNewBridgeButton">
            <Text style={styles.buttonText}>{actionText}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingOverlay loading={loading} />
    </ScrollView>
  );
};

export default BridgeFormScreen;
