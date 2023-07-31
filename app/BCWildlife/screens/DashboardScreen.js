import React,{useEffect} from 'react';
import { View,Text,StyleSheet,
  Image,TouchableOpacity,Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getuserdetails_url } from '../network/path';
import { useState } from 'react';
import LoadingOverlay from '../utility/LoadingOverlay';
import { getAccessToken } from '../global';
import AxiosUtility from '../network/AxiosUtility';


const DashboardScreen = ({route,navigation}) => {
  const { admin } = route.params;
  const [projects, setProjects] = useState([]);
  const[loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let token = getAccessToken();
    let AuthStr = 'Bearer '.concat(token);
    const config = { headers: { Authorization: AuthStr } };

      try {
        const response = await AxiosUtility.get(getuserdetails_url, config);
          setProjects(response.data.projects);
          console.log(response.data);
          var datavar = response.data;
          console.log(datavar.projects);
          EncryptedStorage.setItem("projects", JSON.stringify(datavar.projects));
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
  }, [])


  const showAlertOnly=(title, message)=> {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Ok',
          onPress: () =>{
            console.log('OK Pressed')
          }
        }
      ]
    );
  }

  const hanldeTelemetryForm = () => {
    navigation.navigate('TelemetryForm');
  }

  const handleBridgesClick = () => {
    navigation.navigate('BridgesList');
  }

  const handleTelemetryTriangulation = () => {
    navigation.navigate('TelemetryTriangulation');
  }

  const handleCameraTrapData = () => {
    navigation.navigate('CameraTrapData');
  }

  const handleApproveSignupReqs = () => {
    navigation.navigate('ApproveSignupAccess');
  }

  const handleApproveProjectAccess = () => {
    navigation.navigate('ApproveProjectAccess');
  }

  const handleAddProject = () => {
    navigation.navigate('AddProject');
  }

  const handleProfileNavigation = () => {
    console.log('Profile');
    navigation.navigate('Profile');
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
            handleLogout();
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


  const handleLogout = async () => {
    await EncryptedStorage.clear()
    .then(() => console.log('success'))
    .catch(err => console.log(err));
    navigation.navigate('Login');
  };

  return (
    <View style={{flex:1,flexDirection:'column',backgroundColor: 'white'}}>
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/bc_notext.png')} />
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.c_image} source={require('../assets/bc_logo.png')} />
        </View>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => showAlert('Logout','Are you sure you want to Logout?')}>
            <Image style={styles.l_image} source={require('../assets/logout.png')} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex:1 ,marginTop:90, flexDirection:'row',alignItems:'center'}}>

         <Image style={{height:15,width:15,marginLeft:20}} source={require('../assets/plus_sign.png')} />
         <TouchableOpacity onPress={()=>handleAddProject()}>
         <Text style={{fontSize:20,color:'black',fontWeight:'bold',marginLeft:10}}>Project Setup</Text>
         </TouchableOpacity>
      </View>

      <View style={{flex:1 ,marginTop:15,paddingVertical:10,
         flexDirection:'row',alignItems:'center',
         justifyContent:'space-evenly',
         backgroundColor:'#E8F0FF'}}>
          <TouchableOpacity onPress={()=>handleCameraTrapData()}>
          <Image style={{height:80,width:80,resizeMode:'contain'}} source={require('../assets/cam_trap.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>hanldeTelemetryForm()}>
          <Image style={{height:95,width:95, resizeMode:'contain'}} source={require('../assets/telemetry.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>handleTelemetryTriangulation()}>
          <Image style={{height:100,width:100, resizeMode:'contain'}} source={require('../assets/gtele.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>handleBridgesClick()}>
              <Text style={{fontWeight: "bold"}}>Bridges</Text>
          </TouchableOpacity>
      </View>
      <View style={{flex:1 ,marginTop:10, flexDirection:'row',alignItems:'center'}}>
        <Image style={{height:15,width:15,marginLeft:20,resizeMode:'contain'}} source={require('../assets/proj_req_ico.png')} />
        <TouchableOpacity onPress={()=>navigation.navigate('ProjectAccess')}>
        <Text style={{fontSize:20,color:'black',fontWeight:'bold',marginLeft:10}}>Project Request</Text>
          </TouchableOpacity>
     </View>
      {admin ? (
        <View style={{flex:1 ,marginTop:15,paddingVertical:10,
          flexDirection:'row',alignItems:'center',
          justifyContent:'space-evenly',
          backgroundColor:'#E8F0FF'}}>
            <TouchableOpacity onPress={()=>handleApproveProjectAccess()}>
           <Image style={{height:90,width:90,resizeMode:'contain'}} source={require('../assets/approve_req_access.png')} />
           </TouchableOpacity>
           <TouchableOpacity onPress={()=>handleApproveSignupReqs()}>
           <Image style={{height:85,width:85, resizeMode:'contain'}} source={require('../assets/approve_signup_access.png')} />
           </TouchableOpacity>
       </View>
      ) : null}
     <View style={{flex:1 ,marginTop:10, flexDirection:'row',alignItems:'center'}}>
        <Image style={{height:25,width:25,marginLeft:20,resizeMode:'contain'}} source={require('../assets/ack_ico.png')} />
        <Text style={{fontSize:20,color:'black',fontWeight:'bold',marginLeft:10}}>Acknowledgements / Glossary</Text>
     </View>
      <View style={{flex:2}}>
        <></>
      </View>
      </ScrollView>
      <View style={{flex:0.4, backgroundColor:'#234075',flexDirection:'column',
      justifyContent:'center',alignItems:'center'
       } }>
        <TouchableOpacity style={{alignSelf:'flex-end',marginRight:20}}
        onPress={()=>handleProfileNavigation()}>
          <Image style={{height:50,width:50,
            resizeMode:'contain'}} source={require('../assets/placeholder_profile.png')} />
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
    justifyContent: 'space-between'
  },
  imageContainer: {
    margin: 10
  },
  image: {
    width: 80,
    height: 90,
    resizeMode: 'contain'
  },
  c_image: {
    width: 160,
    height: 70,
    resizeMode: 'contain'
  },
  l_image: {
    width: 70,
    height: 70,
    resizeMode: 'contain'
  }
});

export default DashboardScreen;
