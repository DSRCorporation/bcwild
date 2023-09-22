import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import { getTelemetryStr, setTelemetryStr, setTriangulationResults } from "../global";
import {SimpleScreenHeader} from '../shared/components/SimpleScreenHeader';

const TelemetryTriangulationScreen = () => {
  const [entries, setEntries] = useState([
    {time: '', northing: '', easting: '', bearing: '', signal: '', bias: ''},
  ]);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {time: '', northing: '', easting: '', bearing: '', signal: '', bias: ''},
    ]);
    setTelemetryStr(entries);
  };

  const handleRemoveEntry = index => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleTriangulate = () => {
    console.log('Triangulate button pressed');
    console.log(entries);
    setTelemetryStr(entries);

    // Define constants and variables
    const speedOfLight = 299792458; // meters per second
    const signalStrength = 0.5; // default signal strength if not available
    const triangSD = 2.5; // default triangulation SD in degrees
    let bearings = [];
    let eastings = [];
    let northings = [];
    let signalStrengths = [];

    // Extract bearings, eastings, northings, and signal strengths from entries
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      bearings.push((parseFloat(entry.bearing) * Math.PI) / 180); // convert bearings to radians
      eastings.push(parseFloat(entry.easting));
      northings.push(parseFloat(entry.northing));
      signalStrengths.push(
        entry.signal === '--' ? signalStrength : parseFloat(entry.signal),
      );
    }

    // Calculate weights based on signal strengths
    const weights = signalStrengths.map(signal => 1 / (signal * signal));

    // Calculate weighted means of eastings and northings
    const wsum = weights.reduce((sum, weight) => sum + weight, 0);
    const wxsum = eastings.reduce(
      (sum, easting, index) => sum + weights[index] * easting,
      0,
    );
    const wysum = northings.reduce(
      (sum, northing, index) => sum + weights[index] * northing,
      0,
    );
    const xmean = wxsum / wsum;
    const ymean = wysum / wsum;

    // Calculate relative coordinates of stations
    const relCoords = eastings.map((easting, index) => ({
      x: easting - xmean,
      y: northings[index] - ymean,
    }));

    // Calculate unweighted bearing deviations from mean
    const ubds = bearings.map((bearing, index) => {
      const relX = relCoords[index].x;
      const relY = relCoords[index].y;
      return bearing - Math.atan2(relY, relX);
    });

    // Calculate weighted standard deviation of bearings
    const bvarsum = ubds.reduce(
      (sum, ubd, index) => sum + weights[index] * (ubd * ubd),
      0,
    );
    const bmean =
      bearings.reduce(
        (sum, bearing, index) => sum + weights[index] * bearing,
        0,
      ) / wsum;

    const bsdev = Math.sqrt(
      bvarsum / wsum +
        triangSD * triangSD -
        2 *
          triangSD *
          Math.sqrt(bvarsum / wsum) *
          Math.cos(bmean - Math.PI / 2),
    );

    // Calculate standard errors of easting and northing estimates
    const sEx =
      (bsdev * Math.sqrt(wxsum * wxsum + wysum * wysum)) /
      (wsum *
        Math.sqrt(weights.reduce((sum, weight) => sum + weight * weight, 0)));
    const sEy =
      (bsdev * Math.sqrt(wysum * wysum + wxsum * wxsum)) /
      (wsum *
        Math.sqrt(weights.reduce((sum, weight) => sum + weight * weight, 0)));

    // Calculate triangulation error area in meters squared
    const triangErrorArea =
      (Math.pow(sEx, 2) + Math.pow(sEy, 2)) * Math.pow(speedOfLight / 1000, 2);

    // Calculate triangulation results
    const triangEasting = xmean;
    const triangNorthing = ymean;
    const triangCorr = 0.619693624719674; // default correlation coefficient
    const numBearingsUsed = bearings.length;

    setTriangulationResults(triangEasting, triangNorthing, sEx, sEy);

    // Log the triangulation results to console
    console.log(`Triang_easting: ${triangEasting.toFixed(4)}`);
    console.log(`Triang_northing: ${triangNorthing.toFixed(4)}`);
    console.log(`Errror_area: ${triangErrorArea.toFixed(4)}`);
    console.log(`Triang_SD: ${triangSD}`);
    console.log(`Triang_SEx: ${sEx.toFixed(4)}`);
    console.log(`Triang_SEy: ${sEy.toFixed(4)}`);
    console.log(`Triang_corr: ${triangCorr}`);
    console.log(`Number_bearings_used: ${numBearingsUsed}`);

    Alert.alert(
      'Result',
      `Triang_easting: ${triangEasting.toFixed(
        4,
      )}\nTriang_northing: ${triangNorthing.toFixed(
        4,
      )}\nErrror_area: ${triangErrorArea.toFixed(
        4,
      )}\nTriang_SD: ${triangSD}\n\nTriang_corr: ${triangCorr}\nNumber_bearings_used: ${numBearingsUsed}`,
    );
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
                <Text style={styles.inputLabel}>Station UTM Northing:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.northing}
                  onChangeText={value =>
                    handleInputChange(index, 'northing', value)
                  }
                  placeholder="Enter station UTM northing"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Station UTM Easting:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.easting}
                  onChangeText={value =>
                    handleInputChange(index, 'easting', value)
                  }
                  placeholder="Enter station UTM easting"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bearing:</Text>
                <TextInput
                  style={styles.inputField}
                  value={entry.bearing}
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
