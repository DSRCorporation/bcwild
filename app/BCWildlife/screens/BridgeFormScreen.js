import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LoadingOverlay from '../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {useMockBridges} from '../mocks/mock-bridges';
import {Picker} from '@react-native-picker/picker';
import {InputLabel} from '../shared/components/InputLabel';

const BridgeFormScreen = ({navigation, route}) => {
  const currentBridgeId = (route.params && route.params.bridgeId) || null;
  const {getMockBridgeById} = useMockBridges();
  const [loading, setLoading] = useState(false);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 50,
      backgroundColor: '#fff',
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
  });

  const [form, setForm] = useState({
    region: '',
    bridgeName: '',
    coordinates: '',
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
    waterCurrentlyUnderBridge: '',
    waterIs: '',
    habitatAroundBridge: '',
    habitatComments: '',
  });

  const fillForm = useCallback(() => {
    const currentBridge = getMockBridgeById(currentBridgeId);
    if (!currentBridge) {
      return;
    }
    setForm({
      id: currentBridge.id,
      name: currentBridge.name,
    });
  }, [getMockBridgeById, currentBridgeId]);

  useEffect(() => {
    fillForm();
    console.log('fillForm was changed');
  }, [fillForm]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/bc_abbreviated.png')}
            style={styles.logo}
          />
          <Text style={styles.label}>
            {currentBridgeId ? 'Edit' : 'Create'} Bridge
          </Text>
        </View>
        <View>
          <View>
            <View style={styles.inputContainer}>
              <InputLabel>Bridge name</InputLabel>
              <TextInput
                value={form.bridgeName}
                onChangeText={text =>
                  setForm(prev => ({...prev, bridgeName: text}))
                }
                placeholder="Enter Bridge name"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Coordinates</InputLabel>
              <TextInput
                keyboardType="numeric"
                placeholder="Enter coordinates"
                onChangeText={value =>
                  setForm(prev => ({...prev, coordinates: value}))
                }
                value={form.coordinates}
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Road/Highway</InputLabel>
              <TextInput
                value={form.roadOrHighway}
                onChangeText={text =>
                  setForm(prev => ({...prev, roadOrHighway: text}))
                }
                placeholder="Enter Road/Highway"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>MOT Bridge ID</InputLabel>
              <TextInput
                value={form.motBridgeId}
                onChangeText={text =>
                  setForm(prev => ({...prev, motBridgeId: text}))
                }
                placeholder="Enter MOT Bridge ID"
                style={styles.textInput}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View>
              <InputLabel>Height from beams/deck to surface below</InputLabel>
              <TextInput
                value={form.heightFromBeamsOrDeckToSurfaceBelow}
                onChangeText={text =>
                  setForm(prev => ({
                    ...prev,
                    heightFromBeamsOrDeckToSurfaceBelow: text,
                  }))
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
                  setForm(prev => ({
                    ...prev,
                    length: text,
                  }))
                }
                keyboardType="numeric"
                placeholder="Enter length"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Water currently under bridge</InputLabel>
              <Picker
                selectedValue={form.waterCurrentlyUnderBridge}
                onValueChange={value =>
                  setForm(prev => ({...prev, waterCurrentlyUnderBridge: value}))
                }>
                <Picker.Item label="Select" value={null} />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
            {form.waterCurrentlyUnderBridge === 'yes' && (
              <View style={styles.inputContainer}>
                <InputLabel>Water is</InputLabel>
                <Picker
                  selectedValue={form.waterIs}
                  onValueChange={value =>
                    setForm(prev => ({...prev, waterIs: value}))
                  }>
                  <Picker.Item label="Select" value={null} />
                  <Picker.Item label="Quit" value="quit" />
                  <Picker.Item label="Noisy" value="noisy" />
                </Picker>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#234075',
              borderRadius: 10,
              marginTop: 20,
              marginBottom: 20,
              padding: 10,
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('BridgeForm')}
            accessibilityLabel="create bridge button"
            testID="createNewBridgeButton">
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {currentBridgeId ? 'Edit' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingOverlay loading={loading} />
    </ScrollView>
  );
};

export default BridgeFormScreen;
