import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import bcWildLogoImage from '../../assets/bc_abbreviated.png';

const imageSize = 150;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: imageSize,
    height: imageSize,
    resizeMode: 'contain',
  },
});

export const BCWildLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image source={bcWildLogoImage} style={styles.logo} />
    </View>
  );
};
