import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert, View, Text} from 'react-native';

import {
  SimpleFormContextProvider,
  useSimpleFormContext,
} from '../../shared/components/SimpleForm';
import {standConfig, transectConfig} from './config';
import {SimpleScreenHeader} from '../../shared/components/SimpleScreenHeader';
import {BaseButton} from '../../shared/components/BaseButton';

import {Inputs} from './Input';
import {useIsFocused} from '@react-navigation/native';
import LoadingOverlay from '../../utility/LoadingOverlay';
import {errorMessage, parseTransect} from './parse';
import {ValidationError} from '../../shared/utils/form-validation';
import {InputLabel} from '../../shared/components/InputLabel';
import {NotInitialized} from './NotInitialized';
import {useLocation} from '../Location';

export const createDefaultTransectForm = defaultValues => {
  const form = {stands: []};
  transectConfig.inputs.forEach(({name, defaultValue}) => {
    form[name] = defaultValue ? defaultValue(defaultValues) : '';
  });
  return form;
};

const SaveButton = ({onSave}) => {
  const {form} = useSimpleFormContext();
  return (
    <BaseButton onPress={() => onSave(form)} accessibilityLabel="Save transect">
      Save
    </BaseButton>
  );
};

const CancelButton = ({onCancel}) => (
  <BaseButton onPress={onCancel} accessibilityLabel="Cancel edit">
    Cancel
  </BaseButton>
);

const TransectButtons = ({onSave, onCancel}) => (
  <View>
    <CancelButton onCancel={onCancel} />
    <SaveButton onSave={onSave} />
  </View>
);

// FIXME beautify
const Stand = ({stand, onEdit}) => {
  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
  return (
    <View style={rowStyle} key={stand.id}>
      <Text>{stand.id}</Text>
      <Text onPress={() => onEdit(stand)}>[Edit]</Text>
    </View>
  );
};

const Stands = ({stands, onEdit, onAddStand}) => {
  return (
    <View>
      <InputLabel>Stands</InputLabel>
      <View>
        {stands.map(stand => (
          <Stand key={stand.id} stand={stand} onEdit={onEdit} />
        ))}
      </View>
      <BaseButton onPress={onAddStand} accessibilityLabel="Add stand">
        Add stand
      </BaseButton>
    </View>
  );
};

const TransectFormBody = ({callback, params, state, onSave, onCancel}) => {
  const {styles, form, setLoading, loading} = useSimpleFormContext();
  const [defaultValues, setDefaultValues] = useState(null);

  const onAddStand = async () => {
    setLoading(true);
    let standDefaultValues = {};
    try {
      standDefaultValues = await standConfig.getDefaultValues(state);
    } catch (err) {
      console.error('Cannot load default values for new stand', err);
    }
    setLoading(false);
    await callback.onAddStand(form, standDefaultValues);
  };
  const onSaveValidating = useCallback(() => {
    try {
      const dto = parseTransect(form);
      onSave(dto);
    } catch (error) {
      if (error instanceof ValidationError) {
        Alert.alert('Error', errorMessage(error, transectConfig));
      } else {
        throw error;
      }
    }
  }, [form, onSave]);

  useEffect(() => {
    const loadDefaultValues = async () => {
      let loadedDefaultValues = {};
      try {
        loadedDefaultValues = await transectConfig.getDefaultValues(state);
        setDefaultValues(loadedDefaultValues);
      } catch (err) {
        console.error('Cannot load default values for transect', err);
      }
      setLoading(false);
    };
    loadDefaultValues().catch(err =>
      console.error('This should not happen', err),
    );
  }, [setLoading, state]);

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <SimpleScreenHeader onLogoPress={onCancel}>
            {transectConfig.title}
          </SimpleScreenHeader>
          {defaultValues && (
            <>
              <Inputs inputConfigs={transectConfig.inputs} />
              <Stands
                stands={form.stands}
                onEdit={stand => callback.onEditStand(form, stand)}
                onAddStand={onAddStand}
              />
              <TransectButtons onSave={onSaveValidating} onCancel={onCancel} />
            </>
          )}
        </View>
      </ScrollView>
      <LoadingOverlay loading={loading} />
    </View>
  );
};

export const TransectForm = ({
  initialValue,
  callback,
  state,
  onSave,
  onCancel,
}) => {
  const isFocused = useIsFocused();
  const isInitialized =
    isFocused && initialValue != null && callback != null && state != null;
  if (!isInitialized) {
    return <NotInitialized>{transectConfig.title}</NotInitialized>;
  }
  return (
    <SimpleFormContextProvider initialForm={initialValue} config={{}}>
      <TransectFormBody
        callback={callback}
        state={state}
        onSave={onSave}
        onCancel={onCancel}
      />
    </SimpleFormContextProvider>
  );
};
