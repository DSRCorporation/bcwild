import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import arrowImage from '../../assets/arrow_back_ios.png';

const arrowSize = 30;

const styles = StyleSheet.create({
  arrow: {
    width: arrowSize,
    height: arrowSize,
    marginVertical: 25,
  },
});

export const GoBackArrowButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image style={styles.arrow} source={arrowImage} />
    </TouchableOpacity>
  );
};
