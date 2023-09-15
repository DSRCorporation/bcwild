import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

// Like GalleryPicker but for single image, allows arbitrary children instead
// of button and has no image list.

export const ImagePicker = ({children, onChange}) => {
  const openGallery = useCallback(async () => {
    const result = await launchImageLibrary({});
    if (!result.assets) {
      return;
    }
    const images = result.assets;
    if (Array.isArray(images) && images.length > 0) {
      const image = images[0];
      onChange && onChange(image);
    }
  }, [onChange]);

  return (
    <View>
      <TouchableOpacity onPress={openGallery}>{children}</TouchableOpacity>
    </View>
  );
};
