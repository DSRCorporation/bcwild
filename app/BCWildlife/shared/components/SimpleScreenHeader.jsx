import React from 'react';
import {View} from 'react-native';
import {BCWildLogo} from './BCWildLogo';
import {GoBackArrowButton} from './GoBackArrowButton';
import {TitleText} from './TitleText';

export const SimpleScreenHeader = ({children}) => (
  <View>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1}}>
        <GoBackArrowButton />
      </View>
      <BCWildLogo />
      <View style={{flex: 1}} />
    </View>
    <TitleText>{children}</TitleText>
  </View>
);
