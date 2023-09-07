import EncryptedStorage from 'react-native-encrypted-storage';

export const getName = async () => {
  let firstName;
  let lastName;
  try {
    const sessionJson = await EncryptedStorage.getItem('user_session');
    if (sessionJson == null) {
      throw new Error('Loaded empty session');
    }
    const session = JSON.parse(sessionJson);
    firstName = session.data.first_name;
    lastName = session.data.last_name;
  } catch (err) {}
  return {firstName, lastName};
};
