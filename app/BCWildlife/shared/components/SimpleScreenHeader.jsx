import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {BCWildLogo} from './BCWildLogo';
import {GoBackArrowButton} from './GoBackArrowButton';
import {TitleText} from './TitleText';
import EncryptedStorage from 'react-native-encrypted-storage';

export const SimpleScreenHeader = ({onGoBack, onLogoPress, children, hideBackButton}) => {
  const navigation = useNavigation();
  const navigateToDashboard = useCallback(async () => {
    let session;
    try {
    session = await EncryptedStorage.getItem("user_session");
    } catch (err) {
      return;
    }
    if(!session){
      return;
    }
    const obj = JSON.parse(session);
    if(obj.data.role === 'admin'){
      navigation.navigate('Dashboard', {admin: true});
    }else{
      navigation.navigate('Dashboard', {admin: false});
    }
  }, [navigation]);
  return (
  <View>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1}}>
        {!hideBackButton && <GoBackArrowButton onGoBack={onGoBack} />}
      </View>
      <BCWildLogo onPress={onLogoPress || navigateToDashboard}/>
      <View style={{flex: 1}} />
    </View>
    <TitleText>{children}</TitleText>
  </View>
  )
};
