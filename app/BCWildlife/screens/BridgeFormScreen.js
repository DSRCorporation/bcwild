import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LoadingOverlay from '../utility/LoadingOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {useMockBridges} from '../mocks/mock-bridges';

const BridgeFormScreen = ({navigation, route}) => {
  const currentBridgeId = (route.params && route.params.bridgeId) || null;
  const {getMockBridgeById} = useMockBridges();
  const [loading, setLoading] = useState(false);
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
  });

  const [form, setForm] = useState({
    id: null,
    name: '',
  });

  const fillForm = useCallback(() => {
    const currentBridge = getMockBridgeById(currentBridgeId);
    if (!currentBridge) {
      return;
    }
    setForm({
      id: currentBridge.id,
      name: currentBridge.name,
    });
  }, [getMockBridgeById, currentBridgeId]);

  useEffect(() => {
    fillForm();
    console.log('fillForm was changed');
  }, [fillForm]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/bc_abbreviated.png')}
            style={styles.logo}
          />
          <Text style={styles.label}>
            {currentBridgeId ? 'Edit' : 'Create'} Bridge
          </Text>
        </View>
        <View>
          <TextInput
            value={form.id}
            onChangeText={text => setForm(prev => ({...prev, id: text}))}
            placeholder="ID"
            style={{
              backgroundColor: '#EFEFEF',
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
            }}
          />
          <TextInput
            value={form.name}
            onChangeText={text => setForm(prev => ({...prev, name: text}))}
            placeholder="Name"
            style={{
              backgroundColor: '#EFEFEF',
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
            }}
          />
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
      </View>
      <LoadingOverlay loading={loading} />
    </ScrollView>
  );
};

export default BridgeFormScreen;
