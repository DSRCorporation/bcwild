import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getTriangulationResults, getUsernameG} from '../global';
import RecordsRepo from '../utility/RecordsRepo';
import {getTelemetryStr, setTelemetryStr} from '../global';
import {SimpleScreenHeader} from '../shared/components/SimpleScreenHeader';
import {RecordType} from '../utility/RecordType';
import {InputLabel} from '../shared/components/InputLabel';
import {latLonToUtm10, utm10ToLatLon} from '../shared/utils/convertCoords';
import {BaseButton} from '../shared/components/BaseButton';
import {useLocation} from './Location';
import LoadingOverlay from '../utility/LoadingOverlay';
import {useIsFocused} from '@react-navigation/native';

const TelemetryFormScreen = ({navigation}) => {
  const [projects, setProjects] = React.useState([]);
  const [dateTime, setDateTime] = React.useState('');
  const [surveyId, setSurveyId] = React.useState('');
  const [locationId, setLocationId] = React.useState('');
  const [selectedValueProject, setSelectedValueProject] = useState('');
  const [reuse, setReuse] = useState('');
  const [firstLocation, setFirstLocation] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [ambientTemprature, setAmbientTemprature] = useState('');
  const [cloudCover, setCloudCover] = useState('');
  const [precipitation, setPrecipitation] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [elementIdentified, setElementIdentify] = useState('');
  const [comments, setComments] = React.useState('');
  const [recordIdentifier, setRecordIdentifier] = React.useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [easting, setEasting] = React.useState('');
  const [northing, setNorthing] = React.useState('');
  const [eastingError, setEastingError] = React.useState('');
  const [northingError, setNorthingError] = React.useState('');
  const [longitudeCustom, setLongitudeCustom] = React.useState('');
  const [latitudeCustom, setLatitudeCustom] = React.useState('');
  const [eastingCustom, setEastingCustom] = React.useState('');
  const [northingCustom, setNorthingCustom] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [triangulationResults, setTriangulationResults] = useState(
    getTriangulationResults(),
  );
  const {requestLocationPermission, getLocation, showPermissionRequiredAlert} =
    useLocation();

  const isFocused = useIsFocused();

  useEffect(() => {
    handleLocalValues();
  }, []);

  useEffect(() => {
    setTriangulationResults(getTriangulationResults());
  }, [isFocused]);

  useEffect(() => {
    if (elementIdentified === 'yes') {
      setLongitude(longitudeCustom);
      setLatitude(latitudeCustom);
      setEasting(eastingCustom);
      setNorthing(northingCustom);
      setEastingError('0');
      setNorthingError('0');
    } else if (elementIdentified === 'no') {
      const {lat, lon} = utm10ToLatLon(
        triangulationResults.easting,
        triangulationResults.northing,
      );
      setLongitude(lon ?? '');
      setLatitude(lat ?? '');
      setEasting(triangulationResults.easting ?? '');
      setNorthing(triangulationResults.northing ?? '');
      setEastingError(triangulationResults.eastingError ?? '');
      setNorthingError(triangulationResults.northingError ?? '');
    }
  }, [
    eastingCustom,
    elementIdentified,
    latitudeCustom,
    longitudeCustom,
    northingCustom,
    triangulationResults.easting,
    triangulationResults.eastingError,
    triangulationResults.northing,
    triangulationResults.northingError,
  ]);

  const getCurrentLocation = useCallback(async () => {
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      setLoading(true);
      const {lat, lon} = await getLocation();
      const {easting, northing} = latLonToUtm10(lat, lon);
      setLatitudeCustom(lat);
      setLongitudeCustom(lon);
      setNorthingCustom(northing);
      setEastingCustom(easting);
      setLoading(false);
    } else {
      showPermissionRequiredAlert();
    }
  }, [
    requestLocationPermission,
    getLocation,
    setLoading,
    showPermissionRequiredAlert,
  ]);

  const handleSave = () => {
    console.log('save');
    convertToJson();
    //const data = convertToJson();
    //console.log(data);

    //   const result = performTriangulation(data);
    //   console.log(result);
  };

  function triangulate(bearings) {
    // Convert bearings to unit vectors
    const vectors = bearings.map(bearing => {
      const {x, y, z, bearing: angle} = bearing;
      const rad = (angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return {
        x: cos * x - sin * y,
        y: sin * x + cos * y,
        z: z,
      };
    });

    // Calculate centroid of bearings
    const centroid = vectors.reduce(
      (acc, vector) => {
        acc.x += vector.x;
        acc.y += vector.y;
        acc.z += vector.z;
        return acc;
      },
      {x: 0, y: 0, z: 0},
    );

    centroid.x /= vectors.length;
    centroid.y /= vectors.length;
    centroid.z /= vectors.length;

    // Calculate error ellipse
    const errorEllipse = calculateErrorEllipse(vectors, centroid);

    // Return results
    return {point: centroid, err_ellipse: errorEllipse};
  }

  function calculateErrorEllipse(vectors, centroid) {
    // Calculate distance from each bearing to centroid
    const distances = vectors.map(vector => {
      const dx = vector.x - centroid.x;
      const dy = vector.y - centroid.y;
      const dz = vector.z - centroid.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    });

    // Calculate mean distance and standard deviation
    const mean = distances.reduce((acc, d) => acc + d, 0) / distances.length;
    const stdev = Math.sqrt(
      distances.reduce((acc, d) => acc + (d - mean) ** 2, 0) / distances.length,
    );

    // Calculate error ellipse
    const ellipse = {
      a: stdev,
      b: stdev,
      rho: 0,
      c: centroid,
    };

    return ellipse;
  }

  function performTriangulation(data) {
    const bearings = [];
    data.forEach(entry => {
      const bearing = {
        x: parseFloat(entry.easting),
        y: parseFloat(entry.northing),
        z: parseFloat(entry.bias),
        bearing: parseFloat(entry.bearing),
      };
      bearings.push(bearing);
    });

    const triangulation = triangulate(bearings);
    const {x: Triang_easting, y: Triang_northing} = triangulation.point;
    const Errror_area =
      (Math.PI * triangulation.err_ellipse.a * triangulation.err_ellipse.b) / 4;
    const Triang_SD = Math.sqrt(
      triangulation.err_ellipse.a * triangulation.err_ellipse.b,
    );
    const Triang_SEx = Math.sqrt(triangulation.err_ellipse.a);
    const Triang_SEy = Math.sqrt(triangulation.err_ellipse.b);
    const Triang_corr = triangulation.err_ellipse.rho;
    const Number_bearings_used = bearings.length;

    return {
      Triang_easting,
      Triang_northing,
      Errror_area,
      Triang_SD,
      Triang_SEx,
      Triang_SEy,
      Triang_corr,
      Number_bearings_used,
    };
  }

  // Example usage:
  const data = [
    {
      time: '2023-04-20 15:40:00',
      easting: '595121',
      northing: '5741086',
      bearing: '107',
      signal: '5',
      bias: '0.2',
    },
    {
      time: '2023-04-20 16:03:00',
      easting: '595357',
      northing: '5740371',
      bearing: '73',
      signal: '3',
      bias: '0.3',
    },
    {
      time: '2023-04-20 16:15:00',
      easting: '595834',
      northing: '5739971',
      bearing: '32',
      signal: '3',
      bias: '0.3',
    },
    {
      time: '2023-04-20 16:21:00',
      easting: '595743',
      northing: '5740347',
      bearing: '70',
      signal: '3',
      bias: '0.3',
    },
    {
      time: '2023-04-20 16:28:00',
      easting: '595252',
      northing: '5740502',
      bearing: '90',
      signal: '3',
      bias: '0.3',
    },
  ];

  function setDefaultValues() {
    const defaultDateTime = '';
    const defaultSurveyId = '';
    const defaultLocationId = '';
    const defaultSelectedValueProject = '';
    const defaultReuse = '';
    const defaultFirstLocation = '';
    const defaultAnimalId = '';
    const defaultAmbientTemprature = '';
    const defaultCloudCover = '';
    const defaultPrecipitation = '';
    const defaultWindSpeed = '';
    const defaultElementIdentified = '';
    const defaultComments = '';

    setDateTime(defaultDateTime);
    setSurveyId(defaultSurveyId);
    setLocationId(defaultLocationId);
    setSelectedValueProject(defaultSelectedValueProject);
    setReuse(defaultReuse);
    setFirstLocation(defaultFirstLocation);
    setAnimalId(defaultAnimalId);
    setAmbientTemprature(defaultAmbientTemprature);
    setCloudCover(defaultCloudCover);
    setPrecipitation(defaultPrecipitation);
    setWindSpeed(defaultWindSpeed);
    setElementIdentify(defaultElementIdentified);
    setComments(defaultComments);
    setRecordIdentifier('');
  }

  function convertToJson() {
    if (!selectedValueProject) {
      Alert.alert('Please select a project');
      return;
    }

    if (!dateTime) {
      Alert.alert('Please enter date and time');
      return;
    }
    if (!surveyId) {
      Alert.alert('Please enter survey id');
      return;
    }
    if (!locationId) {
      Alert.alert('Please enter location id');
      return;
    }
    if (!selectedValueProject) {
      Alert.alert('Please select a project');
      return;
    }
    if (!reuse) {
      Alert.alert('Please select reuse');
      return;
    }
    if (!firstLocation) {
      Alert.alert('Please select first location');
      return;
    }
    if (!animalId) {
      Alert.alert('Please enter animal id');

      return;
    }
    if (!ambientTemprature) {
      Alert.alert('Please enter ambient temperature');
      return;
    }
    if (!cloudCover) {
      Alert.alert('Please enter cloud cover');
      return;
    }
    if (!precipitation) {
      Alert.alert('Please enter precipitation');
      return;
    }
    if (!windSpeed) {
      Alert.alert('Please enter wind speed');
      return;
    }
    if (!elementIdentified) {
      Alert.alert('Please enter element identified');
      return;
    }

    if (!easting || easting.toString().length === 0) {
      Alert.alert('Please enter easting or perform triangulation');
      return;
    }

    if (!northing || northing.toString().length === 0) {
      Alert.alert('Please enter northing or perform triangulation');
      return;
    }

    const location_comments = comments || '';

    const triangulation = elementIdentified === 'no' ? getTelemetryStr() : null;

    const data = {
      date: dateTime,
      survey_id: surveyId,
      location_id: locationId,
      project_id: selectedValueProject,
      reuse: reuse,
      first_location_id: firstLocation,
      animal_id: animalId,
      ambient_temperature: ambientTemprature,
      cloud_cover: cloudCover,
      precip: precipitation,
      wind: windSpeed,
      element_identified: elementIdentified,
      easting: easting,
      northing: northing,
      easting_error: eastingError,
      northing_error: northingError,
      location_comments,
      triangulation,
    };
    var recordsValue = JSON.stringify(data);
    var timeNowEpoch = Math.round(new Date().getTime() / 1000);
    console.log(timeNowEpoch);
    var username = getUsernameG();
    var recordIdentifier =
      RecordType.GroundTelemetry + '_' + username + '_' + timeNowEpoch;
    setRecordIdentifier(recordIdentifier);
    RecordsRepo.addRecord(recordIdentifier, recordsValue);
    setDefaultValues();
    setTelemetryStr('');
    Alert.alert('Success', 'Record saved successfully', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  }

  const handleTriangulation = () => {
    console.log('triangulation');
    navigation.navigate('TelemetryTriangulation');
  };

  const handleValueChange = value => {
    console.log(value);
    setSelectedValueProject(value);
    projects.map(project => {
      if (project.project_id === value) {
        setSurveyId(project.project.survey_id);
      }
    });
  };

  const handleLocalValues = async () => {
    try {
      const projectsData = await EncryptedStorage.getItem('projects');
      console.log(projectsData);
      var proj = JSON.parse(projectsData);
      setProjects(proj);

      // datetime
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.toLocaleString('default', {month: 'short'});
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();

      const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
      setDateTime(formattedDate);
    } catch (error) {
      console.log(error);
    }

    if (recordIdentifier === '') {
      var timeNowEpoch = Math.round(new Date().getTime() / 1000);
      console.log(timeNowEpoch);
      var username = getUsernameG();
      var recordIdentifier =
        RecordType.GroundTelemetry + '_' + username + '_' + timeNowEpoch;
      setRecordIdentifier(recordIdentifier);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <SimpleScreenHeader>Telemetry Data</SimpleScreenHeader>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}> Project </Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedValueProject}
              onValueChange={handleValueChange}>
              <Picker.Item label="Select a project" value={null} />
              {projects.map(project => (
                <Picker.Item
                  key={project.id}
                  label={project.project_id}
                  value={project.project_id}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.inputLabel}> Survey ID </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Survey ID"
            keyboardType="default"
            value={surveyId}
            onChangeText={text => setSurveyId(text)}
          />
          <Text style={styles.inputLabel}> Location ID </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Location ID"
            keyboardType="default"
            value={locationId}
            onChangeText={text => setLocationId(text)}
          />
          <Text style={styles.inputLabel}> Re-Use ? </Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={reuse}
              onValueChange={itemValue => setReuse(itemValue)}>
              <Picker.Item label="Select" value={null} />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>
          <Text style={styles.inputLabel}>First Location id at this site</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Location ID"
            keyboardType="default"
            value={firstLocation}
            onChangeText={text => setFirstLocation(text)}
          />
          <Text style={styles.inputLabel}>Animal ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Animal ID"
            keyboardType="default"
            value={animalId}
            onChangeText={text => setAnimalId(text)}
          />

          <Text style={styles.inputLabel}>Ambient Temprature</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Ambient Temprature"
            keyboardType="default"
            value={ambientTemprature}
            onChangeText={text => setAmbientTemprature(text)}
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Date"
            keyboardType="default"
            value={dateTime}
            onChangeText={text => setDateTime(text)}
          />

          <Text style={styles.inputLabel}> Cloud Cover </Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={cloudCover}
              onValueChange={itemValue => setCloudCover(itemValue)}>
              <Picker.Item label="Select" value={null} />
              <Picker.Item label="No Cloud" value="no cloud" />
              <Picker.Item label="Less then 50%" value="less then 50" />
              <Picker.Item label="More then 50%" value="more then 50" />
              <Picker.Item label="100% Clouds" value="100% clouds" />
            </Picker>
          </View>

          <Text style={styles.inputLabel}> Percip </Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={precipitation}
              onValueChange={itemValue => setPrecipitation(itemValue)}>
              <Picker.Item label="Select" value={null} />
              <Picker.Item label="None" value="none" />
              <Picker.Item label="Fog" value="fog" />
              <Picker.Item label="Misty Drizzle" value="misty drizzle" />
              <Picker.Item label="Drizzle" value="drizzle" />
              <Picker.Item label="Light rain" value="light rain" />
              <Picker.Item label="Hard rain" value="hard rain" />
              <Picker.Item label="Snow" value="snow" />
            </Picker>
          </View>

          <Text style={styles.inputLabel}> Wind </Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={windSpeed}
              onValueChange={itemValue => setWindSpeed(itemValue)}>
              <Picker.Item label="Select" value={null} />
              <Picker.Item label="2-5 km/h" value="1" />
              <Picker.Item label="Calm" value="1" />
              <Picker.Item label="Leaves rustle" value="2" />
              <Picker.Item label="Leaves /twigs constantly moving" value="3" />
              <Picker.Item label="Small branch moves,dust rises" value="4" />
              <Picker.Item label="Small tree sway" value="5" />
              <Picker.Item
                label="Large branch moving, wind whistling"
                value="6"
              />
            </Picker>
          </View>

          <Text style={styles.inputLabel}> Element Identified ? </Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={elementIdentified}
              onValueChange={itemValue => setElementIdentify(itemValue)}>
              <Picker.Item label="Select" value={null} />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputContainer}>
              <InputLabel>Coordinates long/lat</InputLabel>
              <View style={{flexDirection: 'row', gap: 8, opacity: 0.5}}>
                <View style={{flex: 1}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Longitude"
                    editable={false}
                    value={longitude.toString()}
                    style={styles.input}
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Latitude"
                    editable={false}
                    value={latitude.toString()}
                    style={[styles.input, {flex: 2}]}
                  />
                </View>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Station Easting/Northing (UTM10)</InputLabel>
              <View style={{flexDirection: 'row', gap: 8}}>
                <View style={{flex: 1}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Enter easting"
                    onChangeText={value => {
                      const {lat, lon} = utm10ToLatLon(value, northing);
                      setEastingCustom(value);
                      setLatitudeCustom(lat ?? '');
                      setLongitudeCustom(lon ?? '');
                    }}
                    editable={elementIdentified === 'yes'}
                    value={easting.toString()}
                    style={styles.input}
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Enter northing"
                    onChangeText={value => {
                      const {lat, lon} = utm10ToLatLon(easting, value);
                      setNorthingCustom(value);
                      setLatitudeCustom(lat ?? '');
                      setLongitudeCustom(lon ?? '');
                    }}
                    editable={elementIdentified === 'yes'}
                    value={northing.toString()}
                    style={[styles.input, {flex: 2}]}
                  />
                </View>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Error Easting/Northing (UTM10)</InputLabel>
              <View style={{flexDirection: 'row', gap: 8}}>
                <View style={{flex: 1}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Error easting"
                    editable={false}
                    value={eastingError.toString()}
                    style={styles.input}
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Error northing"
                    editable={false}
                    value={northingError.toString()}
                    style={[styles.input, {flex: 2}]}
                  />
                </View>
              </View>
              {elementIdentified && elementIdentified === 'yes' && (
                <BaseButton
                  onPress={getCurrentLocation}
                  style={styles.button}
                  accessibilityLabel="get current location"
                  testID="getCurrentLocation">
                  <Text style={styles.buttonText}>Get current location</Text>
                </BaseButton>
              )}
            </View>
          </View>

          <Text style={styles.inputLabel}> Comments </Text>
          <TextInput
            multiline
            numberOfLines={10}
            style={styles.input}
            onChangeText={text => setComments(text)}
            value={comments}
            placeholder="Comments"
          />

          {elementIdentified && elementIdentified === 'no' && (
            <TouchableOpacity
              style={{
                backgroundColor: '#234075',
                borderRadius: 10,
                marginTop: 20,
                marginBottom: 20,
                padding: 10,
                justifyContent: 'center',
              }}
              onPress={handleTriangulation}
              accessibilityLabel="next button"
              testID="nextButton">
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                Triangulate
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: '#234075',
              borderRadius: 10,
              marginTop: 20,
              marginBottom: 20,
              padding: 10,
              justifyContent: 'center',
            }}
            onPress={handleSave}
            accessibilityLabel="next button"
            testID="nextButton">
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'center',
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingOverlay loading={loading} />
    </View>
  );
};

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
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#EFEFEF',
    padding: 10,
    marginBottom: 10,
  },
});

export default TelemetryFormScreen;
