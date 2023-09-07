import React, {useCallback} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert, View} from 'react-native';

import {
  SimpleFormContextProvider,
  useSimpleFormContext,
} from '../../shared/components/SimpleForm';
import {encounterConfig} from './config';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {BaseButton} from '../../shared/components/BaseButton';

import {Inputs} from './Input';
import {useIsFocused} from '@react-navigation/native';
import {errorMessage, parseEncounter} from './parse';
import {ValidationError} from '../../shared/utils/form-validation';
import {NotInitialized} from './NotInitialized';

export const createDefaultEncounterForm = ({id, standId, defaultValues}) => {
  const form = {};
  encounterConfig.inputs.forEach(({name, defaultValue}) => {
    form[name] = defaultValue ? defaultValue(defaultValues) : '';
  });
  form.id = id.toString();
  form.standId = standId;
  return form;
};

const DoneButton = ({onDone}) => (
  <BaseButton onPress={onDone} accessibilityLabel="Done encounter">
    Done
  </BaseButton>
);

const confirmCancel = onCancel => () => 
  Alert.alert('Confirm leave', 'Discard the changes?', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Discard',
      onPress: onCancel,
    },
  ]);

const confirmCallbackOnCancel = callback => confirmCancel(callback.onCancel);

const CancelButton = ({onCancel}) => {
  return (
    <BaseButton
      onPress={confirmCancel(onCancel)}
      accessibilityLabel="Cancel edit">
      Cancel
    </BaseButton>
  );
};

const DeleteButton = ({onDelete}) => {
  const confirm = () =>
    Alert.alert('Confirm deletion', 'Delete the encounter?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: onDelete,
      },
    ]);
  return (
    <BaseButton onPress={confirm} accessibilityLabel="Delete encounter">
      Delete
    </BaseButton>
  );
};

const EncounterButtons = ({encounter, callback, showDeleteButton}) => {
  const onDone = useCallback(() => {
    try {
      parseEncounter(encounter);
      callback.onDone(encounter);
    } catch (error) {
      if (error instanceof ValidationError) {
        Alert.alert('Error', errorMessage(error, encounterConfig));
      } else {
        throw error;
      }
    }
  }, [callback, encounter]);
  return (
    <View>
      {showDeleteButton && (
        <DeleteButton onDelete={() => callback.onDelete(encounter.id)} />
      )}
      <CancelButton onCancel={callback.onCancel} />
      <DoneButton onDone={onDone} />
    </View>
  );
};

const EncounterFormBody = ({initialValue, callback, showDeleteButton}) => {
  const {styles, form} = useSimpleFormContext();
  return (
    <ScrollView>
      <View style={styles.container}>
        <SimpleScreenHeader onLogoPress={confirmCallbackOnCancel(callback)}>
          {encounterConfig.title}
        </SimpleScreenHeader>
        <Inputs inputConfigs={encounterConfig.inputs} />
        <EncounterButtons
          encounter={form}
          callback={callback}
          showDeleteButton={showDeleteButton}
        />
      </View>
    </ScrollView>
  );
};

export const EncounterForm = ({initialValue, callback, state}) => {
  // We want to recreate the form internal state every time the windows receives focus.
  const isFocused = useIsFocused();
  const isInitialized = isFocused && initialValue != null && callback != null;
  if (!isInitialized) {
    return <NotInitialized>{encounterConfig.title}</NotInitialized>;
  }
  const encounterId = state && state.encounter && state.encounter.id;
  // Only show "Delete" if the encounter is edited
  const showDeleteButton = Boolean(
    state &&
      state.stand &&
      state.stand.encounters.find(({id}) => id === encounterId),
  );
  return (
    <SimpleFormContextProvider initialForm={initialValue} config={{state}}>
      <EncounterFormBody
        initialValue={initialValue}
        callback={callback}
        showDeleteButton={showDeleteButton}
      />
    </SimpleFormContextProvider>
  );
};
