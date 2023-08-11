import {Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
});

const InputLabel = ({children}) => (
  <Text style={styles.inputLabel}>{children}</Text>
);

export {InputLabel};
