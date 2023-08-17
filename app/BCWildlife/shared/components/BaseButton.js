import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#234075',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export const BaseButton = ({
  onPress,
  accessibilityLabel,
  testID,
  children,
  disabled,
}) => {
  // FIXME different style for disabled button
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={styles.button}
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};
