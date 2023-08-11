import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {useCardListStyles} from '../../shared/styles/card-list-styles';
import {useMockBridges} from '../../mocks/mock-bridges';
import {GoBackArrowButton} from '../../shared/components/GoBackArrowButton';
import {BCWildLogo} from '../../shared/components/BCWildLogo';
import {TitleText} from '../../shared/components/TitleText';

const BridgeListScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {mockBridges} = useMockBridges();
  const cardListStyles = useCardListStyles();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 25,
    },
    ...cardListStyles,
  });

  const fakeLoading = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fakeLoading();
  }, [fakeLoading]);

  return (
    <View style={styles.container}>
      <GoBackArrowButton />
      <BCWildLogo />
      <TitleText>Bridge list</TitleText>
      <View style={styles.cardList}>
        <ScrollView>
          {mockBridges.map(bridge => (
            <View key={bridge.id} style={styles.card}>
              <Text style={styles.cardName}>{bridge.name}</Text>
              <View style={styles.cardButtonContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BridgeForm', {bridgeId: bridge.id})
                  }
                  style={[styles.cardButton, {backgroundColor: '#234075'}]}>
                  <Text style={styles.cardButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cardButton, {backgroundColor: '#ccc'}]}>
                  <Text style={styles.cardButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: '#234075',
            borderRadius: 10,
            marginTop: 20,
            marginBottom: 20,
            padding: 10,
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('BridgeForm')}
          accessibilityLabel="create bridge button"
          testID="createNewBridgeButton">
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Create
          </Text>
        </TouchableOpacity>
      </View>
      <LoadingOverlay loading={loading} />
    </View>
  );
};

export default BridgeListScreen;
