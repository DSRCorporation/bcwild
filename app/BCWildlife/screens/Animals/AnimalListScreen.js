import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {BaseButton} from '../../shared/components/BaseButton';
import {ScrollView} from 'react-native-gesture-handler';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {useCardListStyles} from '../../shared/styles/card-list-styles';
import {useAnimals} from './use-animals';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {useIsFocused} from '@react-navigation/native';

const AnimalListContainer = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {
    animals,
    loading: loadingAnimals,
    deleteLocalAnimalById,
  } = useAnimals();
  const cardStyles = useCardListStyles();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 25,
    },
    ...cardStyles,
  });
  return (
    <View style={styles.container}>
      <SimpleScreenHeader>Animal list</SimpleScreenHeader>
      <View style={styles.cardList}>
        <ScrollView>
          {animals && animals.length === 0 ? (
            <Text>No animals added yet</Text>
          ) : (
            <>
              {animals.map(animal => (
                <View key={animal.id} style={styles.card}>
                  <Text style={styles.cardName}>{animal.name}</Text>
                  <View style={styles.cardButtonContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AnimalForm', {animalId: animal.id})
                      }
                      style={[styles.cardButton, {backgroundColor: '#234075'}]}>
                      <Text style={styles.cardButtonText}>Edit</Text>
                    </TouchableOpacity>
                    {animal.tag === 'local' && (
                      <TouchableOpacity
                        onPress={() => deleteLocalAnimalById(animal.id)}
                        style={[styles.cardButton, {backgroundColor: '#ccc'}]}>
                        <Text style={styles.cardButtonText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
      <View>
        <BaseButton
          onPress={() => navigation.navigate('AnimalForm')}
          accessibilityLabel="create animal button"
          testID="createNewAnimalButton">
          Create
        </BaseButton>
      </View>
      <LoadingOverlay loading={loading || loadingAnimals} />
    </View>
  );
};

// Destroy the container when unfocused in order to reinitialize the state
// after an animal is added/edited.
const AnimalListScreen = props => {
  const isFocused = useIsFocused();
  return isFocused && <AnimalListContainer {...props} />;
};

export default AnimalListScreen;
