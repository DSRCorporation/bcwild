import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import LoadingOverlay from '../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {useCardListStyles} from '../shared/styles/card-list-styles';
import {useMockBridges} from '../mocks/mock-bridges';

const BridgeListScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {mockBridges} = useMockBridges();
  const cardListStyles = useCardListStyles();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 50,
      backgroundColor: '#fff',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
    },
    ...cardListStyles,
  });

  useEffect(() => {
      console.log(mockBridges);
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image
          style={{height: 30}}
          source={require('../assets/arrow_back_ios.png')}
        />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/bc_abbreviated.png')}
          style={styles.logo}
        />
        <Text style={styles.label}>List of Bridges</Text>
      </View>
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
