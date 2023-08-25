import {BCWildLogo} from '../../shared/components/BCWildLogo';
import {TitleText} from '../../shared/components/TitleText';
import React, {useCallback, useEffect, useMemo} from 'react';
import {InputLabel} from '../../shared/components/InputLabel';
import {Alert, View, ScrollView, TextInput} from 'react-native';
import {useImmer} from 'use-immer';
import {BaseButton} from '../../shared/components/BaseButton';
import {useAnimals} from './use-animals';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {useFormScreenStyles} from '../../shared/styles/use-form-screen-styles';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';

const validateAnimalForm = form => {
  if (!form.id) {
    return {
      isValid: false,
      errorMessage: 'Empty animal ID',
    };
  }
  if (!form.name) {
    return {
      isValid: false,
      errorMessage: 'Empty animal name',
    };
  }
  return {
    isValid: true,
    animal: form,
  };
};

const AnimalFormScreen = ({route, navigation}) => {
  const styles = useFormScreenStyles();
  const currentAnimalId = (route.params && route.params.animalId) || null;
  const {getAnimalById, loading, saveAnimalLocally, animals} = useAnimals();
  const currentAnimal = useMemo(
    () => getAnimalById(currentAnimalId),
    [currentAnimalId, getAnimalById],
  );

  const [form, setForm] = useImmer({
    id: '',
    name: '',
  });
  const actionText = useMemo(
    () => (currentAnimalId ? 'Edit' : 'Create'),
    [currentAnimalId],
  );

  const fillForm = useCallback(() => {
    if (!currentAnimal) {
      return;
    }
    setForm(draft => {
      draft.id = currentAnimal.id;
      draft.name = currentAnimal.name;
    });
  }, [currentAnimal, setForm]);

  const submit = async () => {
    const validated = validateAnimalForm(form);
    try {
      if (validated.isValid) {
        await saveAnimalLocally(validated.animal);
        Alert.alert('Success', 'Animal saved locally');
        navigation.goBack();
      } else {
        Alert.alert('Error', validated.errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Could not save animal';
      console.error('Could not save animal', error);
      Alert.alert(errorMessage);
    }
  };

  useEffect(() => {
    fillForm();
  }, [fillForm]);

  return (
    <>
      <ScrollView style={styles.container}>
        <SimpleScreenHeader>Animal form</SimpleScreenHeader>
        <View>
          <View style={styles.inputContainer}>
            <InputLabel>ID</InputLabel>
            <TextInput
              value={form.id}
              onChangeText={value =>
                setForm(draft => {
                  draft.id = value;
                })
              }
              placeholder="Enter ID"
              style={styles.textInput}
            />
          </View>
          <View style={styles.inputContainer}>
            <InputLabel>Name</InputLabel>
            <TextInput
              value={form.name}
              onChangeText={value =>
                setForm(draft => {
                  draft.name = value;
                })
              }
              placeholder="Enter name"
              style={styles.textInput}
            />
          </View>
          <BaseButton
            accessibilityLabel="create animal button"
            testID="createAnimalButton"
            onPress={submit}>
            {actionText}
          </BaseButton>
        </View>
      </ScrollView>
      <LoadingOverlay loading={loading} />
    </>
  );
};

export default AnimalFormScreen;
