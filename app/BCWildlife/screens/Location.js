import React, {useCallback} from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import {fromLonLat} from 'proj4';
import IntentLauncher from 'react-native-intent-launcher';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';

export const useLocation = () => {
  const packageId = DeviceInfo.getBundleId();

  const requestLocationPermissionAndroid = useCallback(async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission required',
        message:
          'This app needs to access your location to get current position',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }, []);

  const requestLocationPermissioniOS = useCallback(async () => {
    return (await Geolocation.requestAuthorization('whenInUse')) === 'granted';
  }, []);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      return await requestLocationPermissionAndroid();
    } else {
      return await requestLocationPermissioniOS();
    }
  }, [requestLocationPermissioniOS, requestLocationPermissionAndroid]);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          resolve({lat: latitude, lon: longitude});
        },
        error => {
          console.warn(`Error getting current location ${error.message}`);
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    });
  }, []);

  const getUTMCoordinates = utmCoordinates => {
    const [easting, northing] = utmCoordinates;
    return {easting, northing};
  };

  const openPermissionSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      IntentLauncher.startActivity({
        action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
        data: 'package:' + packageId,
      });
    }
  }, [packageId]);

  const showPermissionRequiredAlert = useCallback(() => {
    Alert.alert(
      'Location permission',
      'To get current location please go to settings to enable Location permission.',
      [
        {
          text: 'Open settings',
          onPress: () => openPermissionSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  }, [openPermissionSettings]);

  return {
    requestLocationPermission,
    getLocation,
    openPermissionSettings,
    showPermissionRequiredAlert,
  };
};
