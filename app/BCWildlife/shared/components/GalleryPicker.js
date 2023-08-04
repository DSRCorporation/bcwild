import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {BaseButton} from './BaseButton';

const styles = StyleSheet.create({
  removeButton: {
    fontSize: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const GalleryPicker = ({images = [], onChange}) => {
  const [attachedImages, setAttachedImages] = useState(images);

  const openGallery = useCallback(async () => {
    const result = await launchImageLibrary({});
    if (!result.assets) {
      return;
    }
    setAttachedImages(prev => {
      const newList = prev.concat(result.assets);
      onChange && onChange(newList);
      return newList;
    });
  }, [onChange]);

  return (
    <View>
      <BaseButton
        onPress={openGallery}
        accessibilityLabel="launch camera button"
        testID="launchCameraButton">
        Attach photos
      </BaseButton>
      {attachedImages && attachedImages.length === 0 ? (
        <Text>No attached photos</Text>
      ) : (
        attachedImages.map((image, index) => (
          <View
            key={image.uri}
            style={{
              width: '100%',
              flexDirection: 'row',
              marginBottom: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text numberOfLines={1}>
              {index + 1}. {image.fileName}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() =>
                setAttachedImages(prev =>
                  prev.filter(img => img.uri !== image.uri),
                )
              }>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};
