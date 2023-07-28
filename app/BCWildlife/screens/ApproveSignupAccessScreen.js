import React,{useEffect,useState} from 'react';
import { View, Text, Image, Alert,TouchableOpacity, StyleSheet } from 'react-native';
import { getpendinguser_url } from '../network/path';
import axiosUtility, { generateNewAccessToken } from '../network/AxiosUtility';
import LoadingOverlay from '../utility/LoadingOverlay';
import { ScrollView } from 'react-native-gesture-handler';
import { statuschange_url } from '../network/path';
import EncryptedStorage from 'react-native-encrypted-storage';
import { getAccessToken } from '../global';
import {useCardListStyles} from "../shared/styles/card-list-styles";

const ApproveSignupAccessScreen = (navigation) => {
  const cardListStyles = useCardListStyles();
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
    ...cardListStyles
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  let refreshTokenCount = 0;

  useEffect(() => {
    getPendingSignupAccessRequests();
  }, [])

  const configAuth = () => {
    let token = getAccessToken();
    let AuthStr = 'Bearer '.concat(token);
    return { headers: { Authorization: AuthStr } };
  }




  const onhandleAccept = (item) => {
    console.log(item);
    showAlert('Accept','Are you sure you want to accept this request? ',item);
  }
  const onhandleReject = (item) => {
      showAlert('Reject','Are you sure you want to reject this request?',item);
  }

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
              updateStatus(item, 'approved');
            }else {
              updateStatus(item, 'rejected');
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



    async function updateStatus(id, status) {
      const data = {
        id,
        status,
      };
      setLoading(true);

      const USER_TOKEN = getAccessToken();
      const AuthStr = 'Bearer '.concat(USER_TOKEN);
      try {
        axiosUtility.post(statuschange_url, data,
          { headers: { Authorization: AuthStr } })
        .then(response => {
          showAlertOnly('Success',response.message);
          getPendingSignupAccessRequests();
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
                  axiosUtility.post(statuschange_url, data,configAuth())
                  .then(response => {
                    showAlertOnly('Success',response.message);
                    getPendingSignupAccessRequests();
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

  const getPendingSignupAccessRequests = async () => {
    setLoading(true);

    try {
        axiosUtility.get(getpendinguser_url,
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
                  axiosUtility.get(getpendinguser_url,
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
        <Text style={styles.title}>Approve Signup Access</Text>
      </View>
      <View style={styles.cardList}>
        <ScrollView>
        {items.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardName}>{item.first_name +" "+ item.last_name}  </Text>
            <Text style={styles.cardValue}>{item.email}</Text>
            <View style={styles.cardButtonContainer}>
              <TouchableOpacity
                onPress={() => onhandleAccept(item.id)}
               style={[styles.cardButton, { backgroundColor: '#234075' }]}>
                <Text style={styles.cardButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onhandleReject(item.id)}
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

export default ApproveSignupAccessScreen;
