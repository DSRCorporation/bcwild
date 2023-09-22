import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {BackHandler} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {getuserdetails_url} from '../network/path';
import {useState} from 'react';
import LoadingOverlay from '../utility/LoadingOverlay';
import {getAccessToken} from '../global';
import AxiosUtility from '../network/AxiosUtility';
import VectorImage from "react-native-vector-image";

const DashboardScreen = ({route, navigation}) => {
  const {admin} = route.params;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let token = getAccessToken();
      let AuthStr = 'Bearer '.concat(token);
      const config = {headers: {Authorization: AuthStr}};

      try {
        const response = await AxiosUtility.get(getuserdetails_url, config);
        setProjects(response.data.projects);
        console.log(response.data);
        var datavar = response.data;
        console.log(datavar.projects);
        EncryptedStorage.setItem('projects', JSON.stringify(datavar.projects));
      } catch (error) {
        if (error.response) {
          console.log('Response error:', error.response.data);
          //showAlertOnly('Error',error.response.data.message);
        } else if (error.request) {
          console.log('Request error:', error.request);
          //showAlertOnly('Error',error.response.data.message);
        } else {
          console.log('Error message:', error.message);
          //removed alert unnecessary
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showAlertOnly = (title, message) => {
    Alert.alert(title, message, [
      {
        text: 'Ok',
        onPress: () => {
          console.log('OK Pressed');
        },
      },
    ]);
  };

  const hanldeTelemetryForm = () => {
    navigation.navigate('TelemetryForm');
  };

  const handleBridgesClick = () => {
    navigation.navigate('BridgesList');
  };

  const handleAnimalsClick = () => {
    navigation.navigate('AnimalList');
  };

  const handleAerialTelemetryDataClick = () => {
    navigation.navigate('AerialTelemetryDataForm');
  };

  const handleTransectSurvey = () => {
    navigation.navigate('Transect');
  };

  const handleCameraTrapData = () => {
    navigation.navigate('CameraTrapData');
  };

  const handleBatSurvey = () => {
    navigation.navigate('BatSurveyForm');
  };

  const handleApproveSignupReqs = () => {
    navigation.navigate('ApproveSignupAccess');
  };

  const handleApproveProjectAccess = () => {
    navigation.navigate('ApproveProjectAccess');
  };

  const handleAddProject = () => {
    navigation.navigate('AddProject');
  };

  const handleProfileNavigation = () => {
    console.log('Profile');
    navigation.navigate('Profile');
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {
        text: 'Yes',
        onPress: () => {
          console.log('Yes Pressed');
          handleLogout();
        },
      },
      {
        text: 'No',
        onPress: () => {
          console.log('No Pressed');
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await EncryptedStorage.clear()
      .then(() => console.log('success'))
      .catch(err => console.log(err));
    navigation.navigate('Login');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require('../assets/bc_notext.png')}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.c_image}
              source={require('../assets/bc_logo.png')}
            />
          </View>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() =>
                showAlert('Logout', 'Are you sure you want to Logout?')
              }>
              <VectorImage
                style={{ width: 32, height: 32, marginTop: 24 }}
                source={require('../assets/logout.svg')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleAddProject()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/add_project.svg')}
                />
                <Text style={styles.listItemText}>Project Setup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => navigation.navigate('ProjectAccess')}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/project_access.svg')}
                />
                <Text style={styles.listItemText}>Project Request</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bats</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleBatSurvey()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/bat.svg')}
                />
                <Text style={styles.listItemText}>Bat Survey</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleBridgesClick()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/bridge.svg')}
                />
                <Text style={styles.listItemText}>Bridges</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fisher</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => hanldeTelemetryForm()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/ground_telemetry.svg')}
                />
                <Text style={styles.listItemText}>Ground Telemetry Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleAnimalsClick()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/animals.svg')}
                />
                <Text style={styles.listItemText}>Animals</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleAerialTelemetryDataClick()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/aerial_telemetry.svg')}
                />
                <Text style={styles.listItemText}>Aerial Telemetry Data</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Multi-species</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleCameraTrapData()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/camera.svg')}
                />
                <Text style={styles.listItemText}>Camera Trap Metadata</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={handleTransectSurvey}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/transect.svg')}
                />
                <Text style={styles.listItemText}>Transect Survey</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {admin ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleApproveProjectAccess()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/project_approve.svg')}
                />
                <Text style={styles.listItemText}>Approve Access Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleApproveSignupReqs()}>
                <VectorImage
                  style={styles.menuItemImage}
                  source={require('../assets/account_approve.svg')}
                />
                <Text style={styles.listItemText}>Approve Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <View
        style={{
          backgroundColor: '#234075',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{alignSelf: 'flex-end', marginRight: 20}}
          onPress={() => handleProfileNavigation()}>
          <Image
            style={{height: 50, width: 50, resizeMode: 'contain'}}
            source={require('../assets/placeholder_profile.png')}
          />
        </TouchableOpacity>
      </View>
      <LoadingOverlay loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItem: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  listItemText: {
    color: '#000',
  },
  imageContainer: {
    margin: 10,
  },
  image: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
  },
  c_image: {
    width: 160,
    height: 70,
    resizeMode: 'contain',
  },
  l_image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginStart: 16,
  },
  sectionContent: {
    flex: 1,
    marginTop: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#E8F0FF',
  },
  menuItemImage: {
    height: 32,
    width: 32,
    marginBottom: 4,
  },
});

export default DashboardScreen;
