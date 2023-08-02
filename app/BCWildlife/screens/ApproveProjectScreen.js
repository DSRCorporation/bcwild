import React,{useEffect,useState} from 'react';
import { View, Text, Image, Alert,TouchableOpacity, StyleSheet } from 'react-native';
import { getpendingprojectaccess_url } from '../network/path';
import axiosUtility, { generateNewAccessToken } from '../network/AxiosUtility';
import LoadingOverlay from '../utility/LoadingOverlay';
import { ScrollView } from 'react-native-gesture-handler';
import { statuschange_url,approveproj_url } from '../network/path';
import EncryptedStorage from 'react-native-encrypted-storage';
import { getAccessToken } from '../global';

const ApproveProjectScreen = (navigation) => {


  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  let refreshTokenCount = 0;

  useEffect(() => {
    getPendingProjectAccessRequests();
  }, [])

  const configAuth = () => {
    let token = getAccessToken();
    let AuthStr = 'Bearer '.concat(token);
    return { headers: { Authorization: AuthStr } };
  }




  const onhandleAccept = (item,name,proname) => {
    console.log(item);
    console.log(name);
    showProjectAlertScreen(proname,item, name, 'Accept');
    //showAlert('Accept','Are you sure you want to accept '+name+' this request? ',item);
  }
  const onhandleReject = (item) => {

    showAlert('Reject','Are you sure you want to reject this request?',item);
  }

  const showProjectAlertScreen = (projectId,itemid, name, title) => {
    const buttons = [
      { text: 'Cancel', value: 'cancel' },
      { text: 'Manager', value: 'manager' },
      { text: 'Submitter', value: 'submitter' },
    ];
    let selectedValue = buttons[0].value;

    Alert.alert(
        title,
        `Project ID: ${projectId}\nName: ${name}`,
        buttons.map((button) => ({
          text: button.text,
          onPress: () => {
            selectedValue = button.value;
            console.log(`Selected value: ${selectedValue}`);
            updateStatus(itemid, selectedValue,"approved");
          },
          style: selectedValue === button.value ? 'default' : 'cancel',
        }))
    );
  };

  const showAlert=(title, message,item)=> {
    Alert.alert(
        title,
        message,
        [
          {
            text: 'Yes',
            onPress: () =>{
              console.log('OK Pressed')
              if(title=='Accept'){
                // approve network request
                // do nothing this scenario will not occur
                //updateStatus(item, 'approved');
              }else {
                console.log('reject Pressed')
                updateStatus(item,'manager' ,'rejected');
                // reject network request
              }

            }
          },
          {
            text: 'Cancel',
            onPress: () =>{
              console.log('cancel Pressed')
              // do nothing
            }
          }
        ]
    );
  }

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

  const showAlertOnly=(title, message)=> {
    Alert.alert(
        title,
        message,
        [
          {
            text: 'Ok',
            onPress: () =>{
              if(title=='Info'){
                navigateToDashboard();
              }// else do nothing
              console.log('OK Pressed')

            }
          }
        ]
    );
  }


  const handleGoBack = () => {
    navigation.goBack();
  };



  async function updateStatus(id, project_role,status) {
    if (project_role == 'cancel') {
      return;
    }
    setLoading(true);

    const data = {
      id,
      project_role,
      status,
    };
    setLoading(true);

    const USER_TOKEN = getAccessToken();
    const AuthStr = 'Bearer '.concat(USER_TOKEN);
    try {
      axiosUtility.post(approveproj_url, data,
          { headers: { Authorization: AuthStr } })
          .then(response => {
            showAlertOnly('Success',response.message);
            getPendingProjectAccessRequests();
          }).catch((error) => {
        setLoading(false);
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
                  axiosUtility.post(approveproj_url, data,configAuth())
                      .then(response => {
                        showAlertOnly('Success',response.message);
                        getPendingProjectAccessRequests();
                      }).catch((error) => {
                    setLoading(false);
                    if (error.response) {
                      console.log('Response error:', error.response.data);
                      showAlertOnly('Error',error.response.data.message);
                    } else if (error.request) {
                      console.log('Request error:', error.request);
                      showAlertOnly('Error',error.response.data.message);
                    } else {
                      console.log('Error message:', error.message);
                      showAlertOnly('Error',error.response.data.message);
                    }
                  });
                }).catch((error) => {
              refreshTokenCount++;
              console.log('error generating new access token');
            });
          }else{
            console.log('error message:', errorMessage+' with index '+errorMessage.indexOf('token'));
          }
          showAlertOnly('Error',errorMessage);
          console.log('Response error:', error.response.data);
        } else if (error.request) {
          console.log('Request error:', error.request);
          showAlertOnly('Error','Request error');
        } else {
          console.log('Error', error.message);
          showAlertOnly('Error','Error');
        }
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  const getPendingProjectAccessRequests = async () => {
    setLoading(true);

    try {
      axiosUtility.get(getpendingprojectaccess_url,
          configAuth())
          .then(response => {
            console.log(response);
            var respStr = JSON.stringify(response);
            console.log(respStr);
            var respObj = JSON.parse(respStr);
            var datavar = respObj.data;
            var listItems = datavar.rows;
            setItems(listItems);
            setLoading(false);
            if (listItems.length == 0) {
              showAlertOnly('Info','No pending requests');
            }
          })
          .catch((error) => {
            setLoading(false);
            if (error.response) {
              console.log('Response error:', error.response.data);
              let errorMessage = error.response.data.message;
              if(errorMessage.indexOf('token') > -1 && refreshTokenCount < 1){
                console.log('token expired');
                generateNewAccessToken()
                    .then((response) => {
                      console.log('new access token generated');
                      axiosUtility.get(getpendingprojectaccess_url,
                          configAuth())
                          .then(response => {
                            console.log(response);
                            var respStr = JSON.stringify(response);
                            console.log(respStr);
                            var respObj = JSON.parse(respStr);
                            var datavar = respObj.data;
                            var listItems = datavar.rows;
                            setItems(listItems);
                            setLoading(false);
                            if (listItems.length == 0) {
                              showAlertOnly('Info','No pending requests');
                            }
                          }).catch((error) => {
                        setLoading(false);
                        if (error.response) {
                          console.log('Response error:', error.response.data);
                          showAlertOnly('Error',error.response.data.message);
                        } else if (error.request) {
                          console.log('Request error:', error.request);
                          showAlertOnly('Error',error.response.data.message);
                        } else {
                          console.log('Error message:', error.message);
                          showAlertOnly('Error',error.response.data.message);
                        }
                      });
                    }).catch((error) => {
                  console.log('error generating new access token');
                });
              }else{
                console.log('error message:', errorMessage+' with index '+errorMessage.indexOf('token'));
              }
              showAlertOnly('Error',error.response.data.message);
            } else if (error.request) {
              console.log('Request error:', error.request);
              showAlertOnly('Error',error.response.data.message);
            } else {
              console.log('Error message:', error.message);
              showAlertOnly('Error',error.response.data.message);
            }
          });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  if (items.length === 0) {
    return (
        <View style={{flex:1}}>
          <Text>Loading...</Text>
          <LoadingOverlay loading={loading} />
        </View>
    );
  }


  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>handleGoBack}>
          <Image style={{height:30,width:30,margin:25}} source={require('../assets/arrow_back_ios.png')} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../assets/bc_abbreviated.png')} />
          <Text style={styles.title}>Approve Project Access</Text>
        </View>
        <View style={styles.cardList}>
          <ScrollView>
            {items.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardName}>{item.username +" is requesting for project : "+ item.project_id}  </Text>
                  <Text style={styles.cardValue}>{item.project_role + " role is requested "}</Text>
                  <View style={styles.cardButtonContainer}>
                    <TouchableOpacity
                        onPress={() => onhandleAccept(item.id,item.username,item.project_id)}
                        style={[styles.cardButton, { backgroundColor: '#234075' }]}>
                      <Text style={styles.cardButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onhandleReject(item.id,item.username,item.project_id)}
                        style={[styles.cardButton, { backgroundColor: '#ccc' }]}>
                      <Text style={styles.cardButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            ))}
          </ScrollView>
        </View>
        <LoadingOverlay loading={loading} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    height: 200,
    width: 200,
    marginRight: 16,
    resizeMode:'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black'
  },
  cardList: {
    flex: 7,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 14,
    marginBottom: 16,
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardButton: {
    flex: 1,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ApproveProjectScreen;
