import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export const TitleText = ({children}) => (
  <View style={styles.container}>
    <Text style={styles.text}>{children}</Text>
  </View>
);
