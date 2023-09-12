import React, { useState ,useEffect} from 'react';
import { View, Text, Image, TextInput,Alert, TouchableOpacity } from 'react-native';
import { login_url } from '../network/path';
import EncryptedStorage from 'react-native-encrypted-storage';
import LoadingOverlay from '../utility/LoadingOverlay';
import axiosInstance from '../network/AxiosUtility';
import { setAccessToken,setRefreshToken,setUsernameG } from '../global';
import { ScrollView } from 'react-native-gesture-handler';
import {useBridges} from '../shared/hooks/use-bridges/useBridges';
import {useAnimals} from './Animals/use-animals';


const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {pullBridges} = useBridges();
  const {pullAnimals} = useAnimals();
  const axiosUtility = new axiosInstance.getInstanceWithoutToken();

  useEffect(() => {
    
    async function checkLogin(){
      const session = await EncryptedStorage.getItem("user_session");
      console.log(session);
      if(!session){
        return;
      }
      const fetchToken = await EncryptedStorage.getItem("accessToken");
      console.log(fetchToken);
      setAccessToken(fetchToken);

      const fetchRefreshToken = await EncryptedStorage.getItem("refreshToken");
      console.log(fetchRefreshToken);
      setRefreshToken(fetchRefreshToken);

      const token = await EncryptedStorage.getItem("user_session")
      .then((token) => {
        console.log(token) 
        tokendata = JSON.parse(token);
        console.log(tokendata);
        let dataitem = tokendata.data.username;
        console.log(dataitem);
        setUsernameG(dataitem);
      }).catch((error) => {
        console.log(error)
      });

      try {
        await pullBridges();
        console.log('Bridge list pulled');
      } catch (error) {
        console.error('Failed to pull bridges', error, JSON.stringify(error));
      }
      try {
        await pullAnimals();
        console.log('Animal list pulled');
      } catch (error) {
        console.error('Failed to pull animals', error, JSON.stringify(error));
      }

      const obj = JSON.parse(session);
      if(obj.data.role=='admin'){
        navigation.navigate('Dashboard',{admin:true});
      }else{
        navigation.navigate('Dashboard',{admin:false});
      }
    }
    checkLogin();


    }, [])

  function validateCredentials(username, password) {
    if (!username || !password) {
      return false;
    }
    return true;
  }

  const showAlert=(title, message)=> {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () =>{
            console.log('OK Pressed')
            if(title=='Success'){
              navigateToDashboard();
            }// else do nothing
            
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

  const handleLogin = async() => {
    if(!validateCredentials(username, password)) {
      showAlert('Error','Invalid credentials')
      console.error('Invalid credentials');
      return;
    }
    const data = {
      username: username,
      password: password
    };
    setLoading(true);
    axiosUtility.post(login_url, data)
    .then((response) => {
      setLoading(false);
      console.log('Response:', response.data);
      if(response.data.type=='success'){
        EncryptedStorage.setItem("user_session", JSON.stringify(response.data));
        var respStr = JSON.stringify(response.data);
        console.log('Response string:', respStr);
        var tokens = JSON.parse(respStr);
        
        var refreshToken = tokens.data.tokens.refreshToken;
        EncryptedStorage.setItem("refreshToken", refreshToken);
        setRefreshToken(refreshToken);
        var accessToken = tokens.data.tokens.accessToken;
        EncryptedStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);
        console.log('Response tokens:', accessToken);
        setUsername('');
        setPassword('');
        navigateToDashboard();
      }else{
        showAlert('Error',response.data.message);
      }
    })
    .catch((error) => {
      setLoading(false);
      if (error.response) {
        console.log('Response error:', error.response.data);
        showAlert('Error',error.response.data.message);
      } else if (error.request) {
        console.log('Request error:', error.request);
        showAlert('Error',error.response.data.message);
      } else {
        console.log('Error message:', error.message);
        showAlert('Error',error.response.data.message);
      }
      
    });

  }
    




  return (
      <ScrollView>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: 'white' }}>
      <Image source={require('../assets/bc_logo.png')}
       style={{ width: 200, height: 150 ,resizeMode:'contain',
                      alignItems :'center' 
                      ,justifyContent:'center'}} />
      <Image source={require('../assets/bc_elongated.png')} style={{ width: 200, height: 150 , marginTop:20 }} />

      <Text style={{ fontWeight: 'bold', fontSize: 26, marginTop: 40,color:'black' }}>Login</Text>


      <View style={{ marginTop: 50, width: '80%' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Username</Text>
        <TextInput
          style={{ backgroundColor: '#EFEFEF', padding: 10, borderRadius: 10, marginTop: 5 }}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#C7C7CD"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCompleteType="email"
          returnKeyType="next"
          blurOnSubmit={false}
          accessibilityLabel="Username"
          testID="username"
        />
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>Password</Text>
        <TextInput
          style={{ backgroundColor: '#EFEFEF', padding: 10, borderRadius: 10, marginTop: 5 }}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#C7C7CD"
          secureTextEntry={true}
          autoCompleteType="password"
          returnKeyType="done"
          accessibilityLabel="Password"
          testID="password"
        />
        <TouchableOpacity
          style={{ backgroundColor: '#234075', borderRadius: 10, marginTop: 20, padding: 10,
          justifyContent:'center'
          ,alignItems:'center' }}
          onPress={handleLogin}
          textalign='center'
          accessibilityLabel="Login Button"
          testID="loginButton"
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 18 }}>Login</Text>
        </TouchableOpacity>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity
                  style={{ marginTop: 10 }}
                  accessibilityLabel="Forgot Password Link"
                  testID="forgotPasswordLink"
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={{ color: '#234075', fontWeight: 'bold', fontSize: 16 }}>Forgot Password?</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={{ marginTop: 10 }}
              accessibilityLabel="Signup Link"
              testID="signupLink"
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={{ color: '#234075', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
            </TouchableOpacity>
        </View>    
      </View>
      <LoadingOverlay loading={loading} />
    </View>
    </ScrollView>
  );
};

export default LoginScreen;
