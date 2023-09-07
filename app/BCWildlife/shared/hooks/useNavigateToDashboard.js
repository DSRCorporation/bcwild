import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

export const navigateToDashboard = async navigation => {
  let session;
  try {
    session = await EncryptedStorage.getItem('user_session');
  } catch (err) {
    return;
  }
  if (!session) {
    return;
  }
  const obj = JSON.parse(session);
  const admin = obj.data.role === 'admin';
  navigation.navigate('Dashboard', {admin});
};

export const useNavigateToDashboard = () => {
  const navigation = useNavigation();
  const go = useCallback(
    async () => navigateToDashboard(navigation),
    [navigation],
  );
  return go;
};
