import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {useCardListStyles} from '../../shared/styles/card-list-styles';
import {useBridges} from '../../shared/hooks/use-bridges/useBridges';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {useIsFocused} from '@react-navigation/native';

const BridgeListContainer = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [bridges, setBridges] = useState([]);
  const {bridgeList, bridgeByMotId} = useBridges();
  const cardListStyles = useCardListStyles();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 25,
    },
    ...cardListStyles,
  });
  console.debug('bridges', bridges);

  useEffect(() => {
    const load = async () => {
      try {
        const loadedBridges = await bridgeList();
        setBridges(loadedBridges);
        setLoading(false);
      } catch (error) {
        let errorMessage = 'Error occurred';
        if (error.message) {
          errorMessage = errorMessage;
        }
        Alert.alert('Error', errorMessage);
        console.error('Could not load bridges', error);
      }
    };
    if (loading) {
      load();
    }
  }, [bridgeList, loading]);

  return (
    <View style={styles.container}>
      <SimpleScreenHeader>Bridge list</SimpleScreenHeader>
      <View style={styles.cardList}>
        <ScrollView>
          {bridges.map(bridge => (
            <View key={bridge.bridgeMotId} style={styles.card}>
              <Text style={styles.cardName}>{bridge.bridgeName}</Text>
              <View style={styles.cardButtonContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    const dto = await bridgeByMotId(bridge.bridgeMotId);
                    navigation.navigate('BridgeForm', {bridge: dto});
                  }}
                  style={[styles.cardButton, {backgroundColor: '#234075'}]}>
                  <Text style={styles.cardButtonText}>Edit</Text>
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

// Destroy the container when unfocused in order to reinitialize the state
// after a bridge is added/edited.
const BridgeListScreen = props => {
  const isFocused = useIsFocused();
  return isFocused && <BridgeListContainer {...props} />;
};

export default BridgeListScreen;
