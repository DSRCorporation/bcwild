import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import RecordsRepo from '../utility/RecordsRepo';
import CustomDialogProject from '../utility/CustomDialogProject';
import {getAccessToken} from '../global';
import {dataexport_url, datasyncpush_url} from '../network/path';
import axiosUtility from '../network/AxiosUtility';
import LoadingOverlay from '../utility/LoadingOverlay';
import {generateNewAccessToken} from '../network/AxiosUtility';
import {useBridges} from '../shared/hooks/use-bridges/useBridges';
import {localAnimalToRecord, useAnimals} from './Animals/use-animals';
import {RecordType} from '../utility/RecordType';
import {uploadImages} from '../shared/utils/uploadImages';
import {ImagePicker} from '../shared/components/ImagePicker';
import {
  fetchProfileImage,
  uploadProfileImage,
} from '../shared/utils/uploadProfilePicture';
import VectorImage from 'react-native-vector-image';
import ImageResizer from '@bam.tech/react-native-image-resizer';

// Uploading images
//
// Images are uploaded before the records. If you implement records supporting
// images, you typically represent them using local URIs.  The response to an
// upload request includes the random name the image is saved with on the
// server.  Most likely, you want to update your record to contain the
// server-side name instead of the local URI.  To do this, you register a
// "pusher" in the `imagePushers` object below.  The pusher is a function async
// (record: Record) => Record that performs the upload and updates the record.
// The pushers are dispatched over RecordType's extracted from records' names.
//
// When the data are synced, the first pass includes running the image pushers
// over the records, which upload images and update the records.  Then updated
// records are sent to the server.  Thus, the server never sees local URIs.
//
// For typical usecases, you can construct a pusher using `singleImagePusher`
// or `multipleImagePusher`.  They take a property name and assume that the
// value of the property is a single image or an array thereof, respectively.
// The updated record is the copy of the record where server-side names are
// used for the property value.
//
// When this file is refactored, it makes sense to factor out general image
// uploading utils to one file and the imagePushers object to another.

const singleImagePusher = property => async record => {
  const imageFile = record.data[property];
  if (imageFile == null) {
    return record;
  }
  const response = await uploadImages([imageFile]);
  const fixedData = {...record.data};
  fixedData[property] = response.files[0].filename;
  const fixedRecord = {...record, data: fixedData};
  return fixedRecord;
};

// quick & dirty
const uriBasename = uri => uri.split('/').pop();

const multipleImagePusher = property => async record => {
  const imageFiles = record.data[property];
  if (
    imageFiles == null ||
    (Array.isArray(imageFiles) && imageFiles.length === 0)
  ) {
    return record;
  }
  const compressedImages = [];
  for (const image of imageFiles) {
    try {
      const compressedImage = await ImageResizer.createResizedImage(
        image.uri,
        1000,
        1000,
        'JPEG',
        50,
        0,
        null,
        true,
      );
      compressedImages.push({
        uri: compressedImage.uri,
        size: compressedImage.size,
        fileName: compressedImage.name,
        type: 'image/jpeg',
      });
    } catch (e) {
      console.warn(
        `Error compressing image ${image?.uri}. Error: ${JSON.stringify(e)}`,
      );
    }
  }
  const response = await uploadImages(compressedImages);
  const resultFiles = response.data.files;
  const findResultFilename = ({fileName}) => {
    const basename = uriBasename(fileName);
    const resultFile = resultFiles.find(
      ({originalname}) => originalname === basename,
    );
    return resultFile && resultFile.filename;
  };
  const fixedFiles = compressedImages
    .map(findResultFilename)
    .filter(file => file != null);
  const fixedData = {...record.data};
  fixedData[property] = fixedFiles;
  const fixedRecord = {...record, data: fixedData};
  return fixedRecord;
};

const noOpImagePusher = async record => record;

// Pusher registry
// REGISTER YOUR PUSHER HERE
const imagePushers = {
  [RecordType.Bat]: multipleImagePusher('photos'),
  [RecordType.AerialTelemetry]: multipleImagePusher('photos'),
  [RecordType.Cam]: multipleImagePusher('photos'),
};

const pushRecordImages = async record => {
  const prefix = record.record_identifier.split('_')[0];
  const pusher = imagePushers[prefix] || noOpImagePusher;
  return pusher(record);
};

const pushRecordsImages = async records =>
  Promise.all(records.map(pushRecordImages));

// End uploading images

const ProfileScreen = ({navigation}) => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [fullname, setFullname] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {pullBridges} = useBridges();
  const {animals, pullAnimals} = useAnimals();
  let refreshTokenCount = 0;

  const handleDialogSubmit = (selectedProject, email) => {
    console.log(
      `Exporting data for project ${selectedProject} to email ${email}`,
    );
    setDialogVisible(false);
    setLoading(true);

    const data = {
      email,
      project_id: selectedProject,
    };

    const USER_TOKEN = getAccessToken();
    const AuthStr = 'Bearer '.concat(USER_TOKEN);
    try {
      axiosUtility
        .post(dataexport_url, data, {headers: {Authorization: AuthStr}})
        .then(response => {
          setDialogVisible(false);
          setLoading(false);
          console.log(response);

          Alert.alert('Success', response.data.message);

          //getPendingProjectAccessRequests();
        })
        .catch(error => {
          setLoading(false);
          setDialogVisible(false);
          //setLoading(false);
          if (error.response) {
            let errorMessage = error.response.data.message;
            if (errorMessage?.indexOf('token') > -1) {
              console.log('token expired');
              if (refreshTokenCount > 0) {
                return;
              }
              generateNewAccessToken()
                .then(response => {
                  refreshTokenCount++;
                  console.log('new access token generated');
                  axiosUtility
                    .post(dataexport_url, data, configAuth())
                    .then(response => {
                      setDialogVisible(false);
                      Alert.alert('Success', response.message);
                      //getPendingProjectAccessRequests();
                    })
                    .catch(error => {
                      setDialogVisible(false);
                      //setLoading(false);
                      if (error.response) {
                        console.log('Response error:', error.response.data);
                        Alert.alert('Error', error.response.data.message);
                      } else if (error.request) {
                        console.log('Request error:', error.request);
                        Alert.alert(
                          'Error',
                          'Request error' + error.response.data.message,
                        );
                      } else {
                        console.log('Error message:', error.message);
                        Alert.alert('Error', error.response.data.message);
                      }
                    });
                })
                .catch(error => {
                  setDialogVisible(false);
                  refreshTokenCount++;
                  console.log('error generating new access token');
                });
            } else {
              setDialogVisible(false);
              console.log(
                'error message:',
                errorMessage + ' with index ' + errorMessage?.indexOf('token'),
              );
            }
            Alert.alert('Error', errorMessage);
            console.log('Response error:', error.response.data);
            setDialogVisible(false);
          } else if (error.request) {
            setDialogVisible(false);
            console.log('Request error:', error.request);
            Alert.alert('Error', 'Request error');
          } else {
            setDialogVisible(false);
            console.log('Error', error.message);
            Alert.alert('Error', 'Error');
          }
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const loadPicture = useCallback(async () => {
    const picture = await fetchProfileImage();
    setUserPhoto({uri: `data:image/png;base64,${picture}`});
  }, []);

  useEffect(() => {
    if (renderProfile) {
      renderProfile();
    }
  }, [renderProfile]);

  useEffect(() => {
    loadPicture().catch(error => {
      console.error('profileimage error', error);
    });
  }, [loadPicture]);

  const configAuth = () => {
    let token = getAccessToken();
    let AuthStr = 'Bearer '.concat(token);
    return {headers: {Authorization: AuthStr}};
  };

  const handleResetPassword = () => {
    // navigation to ResetPasswordScreen
    console.log('Reset Password');
    navigation.navigate('ResetPassword');
  };

  const handleExport = async () => {
    // handle export logic
    const projectsData = await EncryptedStorage.getItem('projects');
    console.log(projectsData);
    console.log('Export');
    setDialogVisible(true);
  };

  const pushChanges = async () => {
    // Copy local animals to records
    for (const animal of animals) {
      if (animal.tag === 'local') {
        await RecordsRepo.addRecord(...localAnimalToRecord(animal));
      }
    }
    try {
      const records = await RecordsRepo.getUnsyncedRecords();
      console.log(`Records to sync: ${JSON.stringify(records)}`);
      console.log('Sync');
      let recordsObj;
      try {
        recordsObj = JSON.parse(records);
      } catch (e) {
        Alert.alert('Success', 'No records to sync');
        console.log('error parsing records');
        return;
      }

      if (recordsObj.length < 1) {
        Alert.alert('Success', 'No records to sync');
        return;
      } else {
        console.log(`records to sync: ${recordsObj.length}`);
      }

      recordsObj = await pushRecordsImages(recordsObj); // "fixed" records"

      const animalRecords = []; // syncing animals before aerial telemetry
      const bridgeRecords = []; //syncing bridges before bats
      const commonRecords = [];
      for (const record of recordsObj) {
        if (record.record_identifier.startsWith(RecordType.Animal)) {
          animalRecords.push(record);
        } else if (record.record_identifier.startsWith(RecordType.Bridge)) {
          bridgeRecords.push(record);
        } else {
          commonRecords.push(record);
        }
      }

      const USER_TOKEN = getAccessToken();
      const AuthStr = 'Bearer '.concat(USER_TOKEN);
      try {
        console.log('Starting sync');
        console.log('Syncing animals');
        await axiosUtility
          .post(datasyncpush_url, animalRecords, {
            headers: {Authorization: AuthStr},
          })
          .then(_ => {
            console.log('Syncing bridges');
            return axiosUtility.post(datasyncpush_url, bridgeRecords, {
              headers: {Authorization: AuthStr},
            });
          })
          .then(_ => {
            console.log('Syncing everything else');
            return axiosUtility.post(datasyncpush_url, commonRecords, {
              headers: {Authorization: AuthStr},
            });
          })
          .then(response => {
            console.log(response);
            Alert.alert('Success', response.message);
            RecordsRepo.deleteUnsyncedRecords()
              .then(() => {
                console.log('Successfully deleted all unsynced records');
              })
              .catch(error => {
                console.error('Error deleting unsynced records:', error);
              });
            //getPendingProjectAccessRequests();
          })
          .catch(error => {
            if (error.response) {
              let errorMessage = error.response.data.message;
              if (errorMessage?.indexOf('token') > -1) {
                console.log('token expired');
                if (refreshTokenCount > 0) {
                  return;
                }
                generateNewAccessToken()
                  .then(response => {
                    refreshTokenCount++;
                    console.log('new access token generated');
                    axiosUtility
                      .post(datasyncpush_url, recordsObj, configAuth())
                      .then(response => {
                        Alert.alert('Success', response.message);
                        RecordsRepo.deleteUnsyncedRecords()
                          .then(() => {
                            console.log(
                              'Successfully deleted all unsynced records',
                            );
                          })
                          .catch(error => {
                            console.error(
                              'Error deleting unsynced records:',
                              error,
                            );
                          });
                        //getPendingProjectAccessRequests();
                      })
                      .catch(error => {
                        if (error.response) {
                          console.log('Response error:', error.response.data);
                          Alert.alert('Error', error.response.data.message);
                        } else if (error.request) {
                          console.log('Request error:', error.request);
                          Alert.alert(
                            'Error',
                            'Request error' + error.response.data.message,
                          );
                        } else {
                          console.log('Error message:', error.message);
                          Alert.alert('Error', error.response.data.message);
                        }
                      });
                  })
                  .catch(error => {
                    refreshTokenCount++;
                    console.log('error generating new access token');
                  });
              } else {
                console.log(
                  'error message:',
                  errorMessage +
                    ' with index ' +
                    errorMessage?.indexOf('token'),
                );
              }
              Alert.alert('Error', errorMessage);
              console.log('Response error:', error.response.data);
            } else if (error.request) {
              console.log('Request error:', error.request);
              Alert.alert('Error', 'Request error');
            } else {
              console.log('Error', error.message);
              Alert.alert('Error', 'Error');
            }
          });
      } catch (error) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const pullChanges = async () => {
    try {
      await pullBridges();
    } catch (error) {
      console.error('Failed to pull bridges', error, JSON.stringify(error));
    }
    try {
      await pullAnimals();
    } catch (error) {
      console.error('Failed to pull animals', error, JSON.stringify(error));
      if (error.response) {
        Alert.alert('Error', error.response.data.message);
      } else if (error.request) {
        Alert.alert('Error', `Request error: ${error.request}`);
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleSync = async () => {
    setLoading(true);
    // handle sync logic
    // Syncing the bridges:
    // 1. Locally stored changes are pushed among other records
    // 2. Fresh list of bridges is loaded; obsolete local changes are discarded.
    // Same for animals
    //

    try {
      await pushChanges();
      await pullChanges();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhoto = useCallback(
    async picture => {
      try {
        await uploadProfileImage(picture);
      } catch (error) {
        console.error(
          'Could not upload profile picture',
          JSON.stringify(error, null, 2),
        );
        Alert.alert('Error', 'Could not upload profile picture');
      }
      await loadPicture();
    },
    [loadPicture],
  );

  const renderProfile = useCallback(async () => {
    try {
      const session = await EncryptedStorage.getItem('user_session');
      console.log(session);
      if (!session) {
        return;
      }
      const obj = JSON.parse(session);
      setFullname(obj.data.first_name + ' ' + obj.data.last_name);
      setFname(obj.data.first_name);
      setLname(obj.data.last_name);
      console.log(obj.data.first_name + ' ' + obj.data.last_name);
      console.log(fullname);
      setUserEmail(obj.data.email);
      console.log(obj.data.email);
      setProjects(obj.data.projects);
      console.log(obj.data.projects);
    } catch (e) {
      console.log(e);
    }
  }, [fullname]);

  const handleLogout = async () => {
    try {
      await EncryptedStorage.clear()
        .then(() => console.log('success'))
        .catch(err => console.log(err));
      navigation.navigate('Login');
    } catch (e) {
      console.log(e);
    }
  };

  const navigateToDashboard = async () => {
    const session = await EncryptedStorage.getItem('user_session');
    console.log(session);
    if (!session) {
      return;
    }
    const obj = JSON.parse(session);
    if (obj.data.role == 'admin') {
      navigation.navigate('Dashboard', {admin: true});
    } else {
      navigation.navigate('Dashboard', {admin: false});
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      {
        text: 'Yes',
        onPress: () => {
          console.log('Yes Pressed');
          if (title == 'Logout') {
            handleLogout();
          }
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigateToDashboard()}>
            <VectorImage
              source={require('../assets/arrow_back.svg')}
              style={{height: 25, width: 25, marginTop: 30}}
            />
          </TouchableOpacity>
          <Image
            source={require('../assets/bc_abbreviated.png')}
            style={{
              height: 90,
              width: 90,
              resizeMode: 'contain',
              marginLeft: 35,
            }}
          />
          <TouchableOpacity
            onPress={() =>
              showAlert('Logout', 'Are you sure you want to Logout?')
            }>
            <VectorImage
              style={styles.l_image}
              source={require('../assets/logout.svg')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.photoContainer}>
          <ImagePicker onChange={handleUpdatePhoto}>
            <Image
              style={styles.photo}
              source={userPhoto || require('../assets/placeholder_profile.png')}
            />
          </ImagePicker>
          <Text style={styles.title}>{fullname}</Text>
        </View>

        <Text style={styles.sectionHeader}>User Details</Text>
        <View style={styles.section}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{marginLeft: 15, marginTop: 10, fontSize: 20}}>
              First Name
            </Text>
            <Text style={{marginRight: 15, marginTop: 10, fontSize: 20}}>
              {fname}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{marginLeft: 15, fontSize: 20}}>Last Name</Text>
            <Text style={{marginRight: 15, fontSize: 20}}>{lname}</Text>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{marginLeft: 15, marginBottom: 10, fontSize: 20}}>
              Contact Email
            </Text>
            <Text style={{marginRight: 15, marginBottom: 10, fontSize: 18}}>
              {userEmail}
            </Text>
          </View>
        </View>

        <View style={styles.sectionPlain}>
          <TouchableOpacity onPress={handleResetPassword}>
            <Text style={styles.sectionHeaderResetPass}>
              Click Here to Reset Password
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Project Authorization </Text>
        <View style={styles.section}>
          <View>
            {projects.map((project, index) => (
              <View key={project.id}>
                <Text style={{fontSize: 20, marginLeft: 15}}>
                  {project.project_id}
                </Text>
                {index !== projects.length - 1 && (
                  <View
                    style={{
                      borderBottomColor: 'black',
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.containerExport}>
          <TouchableOpacity style={styles.button} onPress={handleSync}>
            <Text style={styles.textButton}>Sync Offline Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerExport}>
          <TouchableOpacity style={styles.button} onPress={handleExport}>
            <Text style={styles.textButton}>Export Project Data</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 80}} />
        <CustomDialogProject
          visible={dialogVisible}
          onClose={() => setDialogVisible(false)}
          projects={projects}
          onSubmit={handleDialogSubmit}
        />
        <LoadingOverlay loading={loading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    padding: 20,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 9999,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    color: 'black',
    marginBottom: 5,
    marginTop: 15,
  },

  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
  },
  sectionPlain: {
    marginTop: 5,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 15,
    alignSelf: 'flex-start',
  },
  sectionPlus: {
    fontSize: 30,
    color: '#000',
    marginRight: 15,
    alignSelf: 'flex-end',
  },
  sectionHeaderResetPass: {
    fontSize: 18,
    color: '#234075',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  l_image: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginTop: 24,
  },

  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textButton: {
    color: '#fff',
    fontSize: 18,
  },
  containerExport: {
    backgroundColor: '#234075',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    width: '100%',
    padding: 5,
    borderRadius: 10,
  },
});

export default ProfileScreen;
