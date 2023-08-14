import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import RecordsRepo from '../utility/RecordsRepo';
import CustomDialogProject from '../utility/CustomDialogProject';
import { getAccessToken } from '../global';
import { dataexport_url, datasyncpush_url } from '../network/path';
import axiosUtility from '../network/AxiosUtility';
import LoadingOverlay from '../utility/LoadingOverlay';
import { generateNewAccessToken } from '../network/AxiosUtility';
import {useBridges} from '../shared/hooks/use-bridges/useBridges';

const ProfileScreen = ({navigation}) => {
  const [fname,setFname] = useState('');
  const [lname,setLname] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [fullname, setFullname] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {pullBridges} = useBridges();
  var refreshTokenCount=0;


  const handleDialogSubmit = (selectedProject, email) => {
  
    console.log(`Exporting data for project ${selectedProject} to email ${email}`);
    setDialogVisible(false);
    setLoading(true);

    const data = {
      email,
      project_id:selectedProject
    };


    const USER_TOKEN = getAccessToken();
      const AuthStr = 'Bearer '.concat(USER_TOKEN); 
      try {
        axiosUtility.post(dataexport_url, data,
          { headers: { Authorization: AuthStr } })
        .then(response => {
          setDialogVisible(false);
          setLoading(false);
          console.log(response);
        
          Alert.alert('Success',response.data.message);
        
          //getPendingProjectAccessRequests();
        }).catch((error) => {
          setLoading(false);
          setDialogVisible(false);
          //setLoading(false);
          if (error.response) {
              let errorMessage = error.response.data.message;
              if(errorMessage.indexOf('token') > -1){
                console.log('token expired');
                if(refreshTokenCount > 0){
                  return;
                }
                generateNewAccessToken()
                .then((response) => {
                  refreshTokenCount++;
                  console.log('new access token generated');
                  axiosUtility.post(dataexport_url, data,configAuth())
                  .then(response => {
                    setDialogVisible(false);
                    Alert.alert('Success',response.message);
                    //getPendingProjectAccessRequests();
                  }).catch((error) => {
                    setDialogVisible(false);
                    //setLoading(false);
                    if (error.response) {
                      console.log('Response error:', error.response.data);
                      Alert.alert('Error',error.response.data.message);
                    } else if (error.request) {
                      console.log('Request error:', error.request);
                      Alert.alert('Error','Request error' +error.response.data.message);
                    } else {
                      console.log('Error message:', error.message);
                      Alert.alert('Error',error.response.data.message);
                    }
                  });
                }).catch((error) => {
                  setDialogVisible(false);
                  refreshTokenCount++;
                  console.log('error generating new access token');
                });
              }else{
                setDialogVisible(false);
                console.log('error message:', errorMessage+' with index '+errorMessage.indexOf('token'));
              }
              Alert.alert('Error',errorMessage);
            console.log('Response error:', error.response.data);
            setDialogVisible(false);
          } else if (error.request) {
            setDialogVisible(false);
            console.log('Request error:', error.request);
            Alert.alert('Error','Request error');
          } else {
            setDialogVisible(false);
            console.log('Error', error.message);
            Alert.alert('Error','Error');
          }
        });
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
  };




  useEffect(() => {
    renderProfile();
  }, []);

  const configAuth = () => { 
    let token = getAccessToken();
    let AuthStr = 'Bearer '.concat(token);
    return { headers: { Authorization: AuthStr } };
  }

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

  const handleSync = async () => {
    setLoading(true);
    // handle sync logic
    // Syncing the bridges:
    // 1. Locally stored changes are pushed among other records
    // 2. Fresh list of bridges is loaded; obsolete local changes are discarded.
    try {
      await RecordsRepo.getUnsyncedRecords().then((records) => {
          console.log(records);
          console.log('Sync');
          var recordsObj;
          try{
           recordsObj = JSON.parse(records);
          }catch(e){
            Alert.alert('Success','No records to sync');
            console.log('error parsing records');
            return;
          }

          if(recordsObj.length < 1){
            Alert.alert('Success','No records to sync');
            return;
          }else{
            console.log(`records to sync: ${recordsObj.length}`);
          }

          const USER_TOKEN = getAccessToken();
          const AuthStr = 'Bearer '.concat(USER_TOKEN); 
          try {
            axiosUtility.post(datasyncpush_url, recordsObj,
              { headers: { Authorization: AuthStr } })
            .then(response => {
              console.log(response);
              Alert.alert('Success',response.message);
              RecordsRepo.deleteUnsyncedRecords()
                .then(() => {
                  console.log('Successfully deleted all unsynced records');
                })
                .catch((error) => {
                  console.error('Error deleting unsynced records:', error);
                });
              //getPendingProjectAccessRequests();
            }).catch((error) => {
              if (error.response) {
                  let errorMessage = error.response.data.message;
                  if(errorMessage.indexOf('token') > -1){
                    console.log('token expired');
                    if(refreshTokenCount > 0){
                      return;
                    }
                    generateNewAccessToken()
                    .then((response) => {
                      refreshTokenCount++;
                      console.log('new access token generated');
                      axiosUtility.post(datasyncpush_url, recordsObj,configAuth())
                      .then(response => {
                        Alert.alert('Success',response.message);
                        RecordsRepo.deleteUnsyncedRecords()
                        .then(() => {
                          console.log('Successfully deleted all unsynced records');
                        })
                        .catch((error) => {
                          console.error('Error deleting unsynced records:', error);
                        });
                        //getPendingProjectAccessRequests();
                      }).catch((error) => {
                        if (error.response) {
                          console.log('Response error:', error.response.data);
                          Alert.alert('Error',error.response.data.message);
                        } else if (error.request) {
                          console.log('Request error:', error.request);
                          Alert.alert('Error','Request error' +error.response.data.message);
                        } else {
                          console.log('Error message:', error.message);
                          Alert.alert('Error',error.response.data.message);
                        }
                      });
                    }).catch((error) => {
                      refreshTokenCount++;
                      console.log('error generating new access token');
                    });
                  }else{
                    console.log('error message:', errorMessage+' with index '+errorMessage.indexOf('token'));
                  }
                  Alert.alert('Error',errorMessage);
                console.log('Response error:', error.response.data);
              } else if (error.request) {
                console.log('Request error:', error.request);
                Alert.alert('Error','Request error');
              } else {
                console.log('Error', error.message);
                Alert.alert('Error','Error');
              }
            });
          } catch (error) {
            console.error(error);
          }
      });
      try {
        await pullBridges();
        Alert.alert('Success','Bridge data loaded');
      } catch (error) {
        console.error('Failed to pull bridges', error, JSON.stringify(error));
        if (error.response) {
          Alert.alert('Error', error.response.data.message);
        } else if (error.request) {
          Alert.alert('Error', `Request error: ${error.request}`);
        } else {
          Alert.alert('Error', error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }


  const handleUpdatePhoto = () => {
    // handle user photo update logic
    console.log('Update Photo');
    showAlert('Update Photo','Are you sure you want to Replace your photo?');
  };

  const renderProfile = async() => {
    try{
    const session = await EncryptedStorage.getItem("user_session");
      console.log(session);
      if(!session){
        return;
      }
      const obj = JSON.parse(session);
      setFullname(obj.data.first_name+' ' +obj.data.last_name);
      setFname(obj.data.first_name);
      setLname(obj.data.last_name);
      console.log(obj.data.first_name+' ' +obj.data.last_name);
      console.log(fullname)
      setUserEmail(obj.data.email);
      console.log(obj.data.email);
      setProjects(obj.data.projects);
      console.log(obj.data.projects);

    } catch(e){
      console.log(e);
    }

    
  };



  const handleLogout = async () => {
    try{
       await EncryptedStorage.clear()
    .then(() => console.log('success'))
    .catch(err => console.log(err));
      navigation.navigate('Login');
    }catch(e){
      console.log(e);
    }
  };

  const navigateToDashboard = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    console.log(session);
    if(!session){
      return;
    }
    const obj = JSON.parse(session);
    if(obj.data.role=='admin'){
      navigation.navigate('Dashboard',{admin:true});
    }else{
      navigation.navigate('Dashboard',{admin:false});
    }
  }

  const showAlert=(title, message)=> {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Yes',
          onPress: () =>{
            console.log('Yes Pressed')
            if(title=='Logout'){
              handleLogout();
            }
          } 
        },
        {
          text: 'No',
          onPress: () =>{
            console.log('No Pressed')
          } 
        }
      ]
    );
  }



  return (
    <ScrollView>
    <View style={styles.container}>

        <View style={{ flexDirection:'row' , width:'100%',justifyContent:'space-between'}}>
            <TouchableOpacity onPress={() => navigateToDashboard()}>
                <Image source={require('../assets/arrow_back_ios.png')}
                style={{height:25,width:25 , marginTop:30}} /> 
                </TouchableOpacity>  
            <Image source={require('../assets/bc_abbreviated.png')} 
            style={{height:90,
                width:90,resizeMode:'contain',marginLeft:35}} />
            <TouchableOpacity
             onPress={() => showAlert('Logout','Are you sure you want to Logout?')}>
              <Image style={styles.l_image} source={require('../assets/logout.png')} />
            </TouchableOpacity>
        </View>
        

      <View style={styles.photoContainer}>
        <TouchableOpacity onPress={handleUpdatePhoto}>
          <Image
            style={styles.photo}
            source={userPhoto ? { uri: userPhoto } : require('../assets/placeholder_profile.png')}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{fullname}</Text>
      </View>

      <Text style={styles.sectionHeader}>User Details</Text>
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ marginLeft:15 ,marginTop:10,fontSize:20}}>First Name</Text>
        <Text style={{marginRight:15 ,marginTop:10,fontSize:20}}>{fname}</Text>                  
        </View>
        <View
                    style={{
                      borderBottomColor: 'black',
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
            />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ marginLeft:15 ,fontSize:20}}>Last Name</Text>
        <Text style={{ marginRight:15 ,fontSize:20}}>{lname}</Text>
        </View>
        <View
                    style={{
                      borderBottomColor: 'black',
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
            />
       
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ marginLeft:15 ,marginBottom:10,fontSize:20}}>Contact Email</Text>
        <Text style={{ marginRight:15 ,marginBottom:10,fontSize:18}}>{userEmail}</Text>
        </View>
      </View>

      <View style={styles.sectionPlain}>
        <TouchableOpacity onPress={handleResetPassword}>
          <Text style={styles.sectionHeaderResetPass}>Click Here to Reset Password</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Project Authorization </Text>
      <View style={styles.section}>
          <View>
            {projects.map((project, index) => (
              <View key={project.id}>
                <Text style={{fontSize:20,marginLeft:15}}>{project.project_id}</Text>
                {index !== projects.length - 1 && <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
                }
              </View>
            ))}
          </View>
      </View>

      <View style={styles.containerExport}> 
            <TouchableOpacity style={styles.button}
            onPress={handleSync}>
              <Text style={styles.textButton}>Sync Offline Data</Text>
            </TouchableOpacity>
       </View>

        <View style={styles.containerExport}>
            <TouchableOpacity style={styles.button}
            onPress={handleExport}>
              <Text style={styles.textButton}>Export Project Data</Text>
            </TouchableOpacity>
        </View>
        <View style={{marginBottom:80}}>
        </View>
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
    resizeMode: 'contain'
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
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
    width: 60,
    height: 60,
    resizeMode: 'contain'
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
