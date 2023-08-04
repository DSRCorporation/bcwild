import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {BaseButton} from '../../shared/components/BaseButton';
import {BCWildLogo} from '../../shared/components/BCWildLogo';
import {TitleText} from '../../shared/components/TitleText';
import {GoBackArrowButton} from '../../shared/components/GoBackArrowButton';
import {ScrollView} from 'react-native-gesture-handler';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {useCardListStyles} from '../../shared/styles/card-list-styles';
import {useAnimals} from './use-animals';

const AnimalListScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {animals, loading: loadingAnimals} = useAnimals();
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
      <GoBackArrowButton />
      <BCWildLogo />
      <TitleText>Animals list</TitleText>
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
                    <TouchableOpacity
                      style={[styles.cardButton, {backgroundColor: '#ccc'}]}>
                      <Text style={styles.cardButtonText}>Delete</Text>
                    </TouchableOpacity>
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

export default AnimalListScreen;
