import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import {setTelemetryStr, setTriangulationResults} from '../global';
import {SimpleScreenHeader} from '../shared/components/SimpleScreenHeader';
import {latLonToUtm10, utm10ToLatLon} from '../shared/utils/convertCoords';
import {BaseButton} from '../shared/components/BaseButton';
import {useLocation} from './Location';
import LoadingOverlay from '../utility/LoadingOverlay';
import {createTriangulationSolver} from '../shared/utils/triangulation';

const solveTriangulation = createTriangulationSolver({
  maxIterations: 100,
  epsilon: 0.1,
  angleError: 2.5, // as in test data
});

const TelemetryTriangulationScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {requestLocationPermission, getLocation, showPermissionRequiredAlert} =
    useLocation();

  const [entries, setEntries] = useState([
    {
      time: '',
      longitude: '',
      latitude: '',
      northing: '',
      easting: '',
      bearing: '',
      signal: 'constant',
      bias: '',
    },
  ]);

  const handleAddEntry = useCallback(() => {
    setEntries([
      ...entries,
      {
        time: '',
        longitude: '',
        latitude: '',
        northing: '',
        easting: '',
        bearing: '',
        signal: 'constant',
        bias: '',
      },
    ]);
    setTelemetryStr(entries);
  }, [entries]);

  const handleRemoveEntry = useCallback(
    index => {
      setEntries(entries.filter((_, i) => i !== index));
    },
    [entries],
  );

  const handleInputChange = useCallback(
    (index, field, value) => {
      const newEntries = [...entries];
      newEntries[index][field] = value;
      setEntries(newEntries);
    },
    [entries],
  );

  const getCurrentLocation = useCallback(
    async index => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        setLoading(true);
        const {lat, lon} = await getLocation();
        const {easting, northing} = latLonToUtm10(lat, lon);
        handleInputChange(index, 'longitude', lon);
        handleInputChange(index, 'latitude', lat);
        handleInputChange(index, 'easting', easting);
        handleInputChange(index, 'northing', northing);
        setLoading(false);
      } else {
        showPermissionRequiredAlert();
      }
    },
    [
      requestLocationPermission,
      getLocation,
      handleInputChange,
      showPermissionRequiredAlert,
    ],
  );

  const handleTriangulate = () => {
    console.log('Triangulate button pressed');
    console.log(entries);
    if (entries.length < 2) {
      Alert.alert('Error', 'Triangulation requires at least two entries');
      return;
    }
    const data = entries.map(({northing, easting, bearing}) => ({
      northing: parseFloat(northing),
      easting: parseFloat(easting),
      bearing: parseFloat(bearing),
    }));
    console.log(data);
    try {
      const triangulationResult = solveTriangulation(data);
      console.log(triangulationResult);
      setTelemetryStr(entries);
      setTriangulationResults(
        triangulationResult.easting,
        triangulationResult.northing,
        triangulationResult.eastingError,
        triangulationResult.northingError,
        triangulationResult.errorArea,
      );
      Alert.alert(
        'Result',
        `Easting: ${triangulationResult.easting.toFixed(4)}
      \nNorthing: ${triangulationResult.northing.toFixed(4)}
      \nError Easting: ${triangulationResult.eastingError.toFixed(4)}
      \nError Northing: ${triangulationResult.northingError.toFixed(4)}
      \nError area: ${triangulationResult.errorArea}
      \nNumber of bearings used: ${triangulationResult.nBearings}`,
        [
          {text: 'Cancel', onPress: () => {}},
          {text: 'Save', onPress: () => navigation.goBack()},
        ],
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleScreenHeader>
        Radio Telemetry Triangulation Calculator
      </SimpleScreenHeader>

      {/* Add/remove entry section */}
      <View style={styles.entryControls}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <Text style={styles.buttonText}>Add Entry</Text>
        </TouchableOpacity>
        {entries.length > 1 && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveEntry(entries.length - 1)}>
            <Text style={styles.buttonText}>Remove Last Entry</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Entry input fields */}
      <ScrollView style={styles.entryFields}>
        <View>
          {entries.map((entry, index) => (
            <View key={index} style={styles.entryContainer}>
              <Text style={styles.entryHeader}>Entry {index + 1}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.time}
                  onChangeText={value =>
                    handleInputChange(index, 'time', value)
                  }
                  placeholder="Enter time in 24-hour format (HH:mm)"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Station Longitude:</Text>
                <TextInput
                  style={{...styles.inputField, opacity: 0.5}}
                  value={entry.longitude?.toString() ?? ''}
                  editable={false}
                  placeholder="Station longitude"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Station Latitude:</Text>
                <TextInput
                  style={{...styles.inputField, opacity: 0.5}}
                  value={entry.latitude?.toString() ?? ''}
                  editable={false}
                  placeholder="Station latitude"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Station UTM Northing:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.northing?.toString() ?? ''}
                  keyboardType="numeric"
                  onChangeText={value => {
                    const {lat, lon} = utm10ToLatLon(entry.easting, value);
                    handleInputChange(index, 'northing', value);
                    handleInputChange(index, 'longitude', lon);
                    handleInputChange(index, 'latitude', lat);
                  }}
                  placeholder="Enter station UTM northing"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Station UTM Easting:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.easting?.toString() ?? ''}
                  keyboardType="numeric"
                  onChangeText={value => {
                    const {lat, lon} = utm10ToLatLon(value, entry.northing);
                    handleInputChange(index, 'easting', value);
                    handleInputChange(index, 'longitude', lon);
                    handleInputChange(index, 'latitude', lat);
                  }}
                  placeholder="Enter station UTM easting"
                />
              </View>
              <BaseButton
                onPress={() => getCurrentLocation(index)}
                style={styles.button}
                accessibilityLabel="get current location"
                testID="getCurrentLocation">
                <Text style={styles.buttonText}>Get current location</Text>
              </BaseButton>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bearing:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.bearing}
                  keyboardType="numeric"
                  onChangeText={value =>
                    handleInputChange(index, 'bearing', value)
                  }
                  placeholder="Enter bearing in degrees"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Signal:</Text>
                <View style={styles.inputField}>
                  <Picker
                    selectedValue={entry.signal}
                    onValueChange={value =>
                      handleInputChange(index, 'signal', value)
                    }>
                    <Picker.Item label="Constant" value="constant" />
                    <Picker.Item label="Pulsing" value="pulsing" />
                    <Picker.Item label="Faint" value="faint" />
                    <Picker.Item label="Mortality" value="mortality" />
                  </Picker>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bias:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.bias}
                  onChangeText={value =>
                    handleInputChange(index, 'bias', value)
                  }
                  placeholder="Enter bias"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Triangulate button */}
      <TouchableOpacity
        style={styles.triangulateButton}
        onPress={handleTriangulate}>
        <Text style={styles.buttonText}>Triangulate</Text>
      </TouchableOpacity>
      <LoadingOverlay loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  entryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#234075',
    padding: 10,
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  entryFields: {
    flex: 1,
    height: 300,
    width: '100%',
  },
  entryContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  entryHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  inputField: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  triangulateButton: {
    backgroundColor: '#234075',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
});

export default TelemetryTriangulationScreen;
