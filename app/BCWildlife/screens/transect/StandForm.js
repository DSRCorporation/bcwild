import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert, View, Text} from 'react-native';

import {
  SimpleFormContextProvider,
  useSimpleFormContext,
} from '../../shared/components/SimpleForm';
import {encounterConfig, standConfig} from './config';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {BaseButton} from '../../shared/components/BaseButton';

import {Inputs} from './Input';
import {useIsFocused} from '@react-navigation/native';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {ValidationError} from '../../shared/utils/form-validation';
import {errorMessage, parseStand} from './parse';
import {useNavigateToDashboard} from '../../shared/hooks/useNavigateToDashboard';
import {InputLabel} from '../../shared/components/InputLabel';
import {NotInitialized} from './NotInitialized';

export const createDefaultStandForm = (id, params) => {
  const form = {encounters: []};
  standConfig.inputs.forEach(({name, defaultValue}) => {
    form[name] = defaultValue ? defaultValue(params) : '';
  });
  form.id = id;
  return form;
};

const DoneButton = ({onDone}) => (
  <BaseButton onPress={onDone} accessibilityLabel="Add stand">
    Done
  </BaseButton>
);

const CancelButton = ({onCancel}) => (
  <BaseButton onPress={onCancel} accessibilityLabel="Cancel edit">
    Cancel
  </BaseButton>
);

const DeleteButton = ({onDelete}) => {
  const confirm = () =>
    Alert.alert('Confirm deletion', 'Delete the stand?', [
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
    <BaseButton onPress={confirm} accessibilityLabel="Delete stand">
      Delete
    </BaseButton>
  );
};

const StandButtons = ({onDone, onCancel, onDelete, showDeleteButton}) => (
  <View>
    {showDeleteButton && <DeleteButton onDelete={onDelete} />}
    <CancelButton onCancel={onCancel} />
    <DoneButton onDone={onDone} />
  </View>
);

const Encounter = ({encounter, onEdit}) => {
  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
  return (
    <View style={rowStyle} key={encounter.id}>
      <Text>{encounter.id}</Text>
      <Text onPress={() => onEdit(encounter)}>[Edit]</Text>
    </View>
  );
};

const Encounters = ({encounters, onEdit, onAddEncounter}) => {
  return (
    <View>
      <InputLabel>Stands</InputLabel>
      <View>
        {encounters.map(encounter => (
          <Encounter key={encounter.id} encounter={encounter} onEdit={onEdit} />
        ))}
      </View>
      <BaseButton onPress={onAddEncounter} accessibilityLabel="Add encounter">
        Add encounter
      </BaseButton>
    </View>
  );
};

const StandFormBody = ({callback, params, state, showDeleteButton}) => {
  const {styles, form} = useSimpleFormContext();
  const [loading, setLoading] = useState(false);
  const onAddEncounter = async () => {
    setLoading(true);
    let encounterDefaultValues = {};
    try {
      encounterDefaultValues = await encounterConfig.getDefaultValues(state);
    } catch (err) {
      console.error('Cannot load default values for new encounter', err);
    }
    setLoading(false);
    callback.onAddEncounter(form, encounterDefaultValues);
  };
  const onDone = useCallback(() => {
    try {
      parseStand(form);
      callback.onDone(form);
    } catch (error) {
      if (error instanceof ValidationError) {
        Alert.alert('Error', errorMessage(error, standConfig));
      } else {
        throw error;
      }
    }
  }, [callback, form]);
  const onCancel = useCallback(
    () =>
      Alert.alert('Confirm leave', 'Discard the changes?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          onPress: callback.onCancel,
        },
      ]),
    [callback],
  );
  return (
    <ScrollView>
      <View style={styles.container}>
        <SimpleScreenHeader hideBackButton onLogoPress={onCancel}>
          {standConfig.title}
        </SimpleScreenHeader>
        <Inputs inputConfigs={standConfig.inputs} />
        <Encounters
          encounters={form.encounters}
          onEdit={encounter => callback.onEditEncounter(form, encounter)}
          onAddEncounter={onAddEncounter}
        />
        <StandButtons
          showDeleteButton={showDeleteButton}
          onDone={onDone}
          onCancel={onCancel}
          onDelete={() => callback.onDelete(form.id)}
        />
      </View>
      <LoadingOverlay loading={loading} />
    </ScrollView>
  );
};

export const StandForm = ({initialValue, callback, state}) => {
  const isFocused = useIsFocused();
  const isInitialized =
    isFocused && initialValue != null && callback != null && state != null;
  if (!isInitialized) {
    return <NotInitialized>{standConfig.title}</NotInitialized>;
  }
  const standId = state.stand.id;
  // Only show "Delete" if the stand is edited
  const showDeleteButton = Boolean(
    state.transect.stands.find(({id}) => id === standId),
  );
  return (
    <SimpleFormContextProvider initialForm={initialValue} config={{}}>
      <StandFormBody
        callback={callback}
        state={state}
        showDeleteButton={showDeleteButton}
      />
    </SimpleFormContextProvider>
  );
};
