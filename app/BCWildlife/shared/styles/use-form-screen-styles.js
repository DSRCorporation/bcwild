import {StyleSheet} from 'react-native';

export const useFormScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 25,
    },
    inputContainer: {
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: '#EFEFEF',
      padding: 10,
      borderRadius: 10,
      marginTop: 5,
    },
  });
};
