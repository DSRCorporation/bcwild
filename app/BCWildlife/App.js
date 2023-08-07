import React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import AddProjectScreen from './screens/AddProjectScreen';
import ProjectRequestAccessScreen from './screens/ProjectRequestAccessScreen';
import ApproveSignupAccessScreen from './screens/ApproveSignupAccessScreen';
import DashboardScreen from './screens/DashboardScreen';
import ApproveProjectScreen from './screens/ApproveProjectScreen';
import TelemetryTriangulationScreen from './screens/TelemetryTriangulation';
import {useEffect} from 'react';
import BridgesListScreen from './screens/BridgesListScreen';
import BridgeFormScreen from './screens/BridgeFormScreen';
import {setAccessToken} from './global';
import {setRefreshToken} from './global';
import CameraTrapDataScreen from './screens/CameraTrapDataScreen';
import ProfileScreen from './screens/ProfileScreen';
import TelemetryFormScreen from './screens/TelemetryFormScreen';
import BatSurveyFormScreen from './screens/BatSurvey/BatSurveyFormScreen';
import AnimalFormScreen from './screens/Animals/AnimalFormScreen';
import AnimalListScreen from './screens/Animals/AnimalListScreen';
import AerialTelemetryDataFormScreen from './screens/AerialTelemetryDataFormScreen';

const Stack = createStackNavigator();

const MyTheme = {
  colors: {
    primary: 'rgb(255, 255, 255)',
  },
};

function App() {
  useEffect(() => {
    async function updateLocalValues() {
      const accToken = await EncryptedStorage.getItem('accessToken')
        .then(token => {
          console.log(token);
          setAccessToken(token);
        })
        .catch(error => {
          console.log(error);
        });

      const refToken = await EncryptedStorage.getItem('refreshToken')
        .then(token => {
          console.log(token);
          setRefreshToken(token);
        })
        .catch(error => {
          console.log(error);
        });
    }
    updateLocalValues();
  }, []);

  return (
    <NavigationContainer theme={MyTheme} initialRouteName="Login">
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AddProject" component={AddProjectScreen} />
        <Stack.Screen
          name="ApproveSignupAccess"
          component={ApproveSignupAccessScreen}
        />
        <Stack.Screen
          name="ApproveProjectAccess"
          component={ApproveProjectScreen}
        />
        <Stack.Screen
          name="ProjectAccess"
          component={ProjectRequestAccessScreen}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CameraTrapData" component={CameraTrapDataScreen} />
        <Stack.Screen
          name="TelemetryTriangulation"
          component={TelemetryTriangulationScreen}
        />
        <Stack.Screen name="TelemetryForm" component={TelemetryFormScreen} />
        <Stack.Screen name="BridgesList" component={BridgesListScreen} />
        <Stack.Screen name="BridgeForm" component={BridgeFormScreen} />
        <Stack.Screen name="BatSurveyForm" component={BatSurveyFormScreen} />
        <Stack.Screen name="AnimalList" component={AnimalListScreen} />
        <Stack.Screen name="AnimalForm" component={AnimalFormScreen} />
        <Stack.Screen
          name="AerialTelemetryDataForm"
          component={AerialTelemetryDataFormScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
