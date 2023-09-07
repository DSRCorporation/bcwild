import React from 'react';
import {ScrollView, View} from 'react-native';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {useFormScreenStyles} from '../../shared/styles/use-form-screen-styles';

export const NotInitialized = ({children}) => {
  const styles = useFormScreenStyles();
  return (
    <ScrollView>
      <View style={styles.container}>
        <SimpleScreenHeader>{children}</SimpleScreenHeader>
      </View>
    </ScrollView>
  );
};
