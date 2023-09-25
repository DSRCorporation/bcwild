import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {getUsernameG} from '../../global';
import {useNavigateToDashboard} from '../../shared/hooks/useNavigateToDashboard';
import RecordsRepo from '../../utility/RecordsRepo';
import {createAutofill} from './createAutofill';
import {
  clearState,
  emptyState,
  loadState,
  transectNavCallback,
} from './navigation';
import {TransectForm} from './TransectForm';
import {RecordType} from '../../utility/RecordType';

const saveRecord = async dto => {
  const timestamp = Date.now();
  dto.time = timestamp;
  const strvalue = JSON.stringify(dto);
  const timeNowEpoch = Math.round(timestamp / 1000);
  const username = getUsernameG();
  const recordIdentifier = `${RecordType.Transect}_${username}_${timeNowEpoch}`;
  await RecordsRepo.addRecord(recordIdentifier, strvalue);
  await clearState();
  Alert.alert('Success', 'Transect survey saved locally');
};

const submit = async (dto, navigation) => {
  await saveRecord(dto);
  Alert.alert('Success', 'Transect survey saved locally', [
    {
      title: 'OK',
      onPress: () => navigation.goBack(),
    },
  ]);
};

const setup = async ({
  setState,
  setCallback,
  createNavCallback,
  isFocused,
  navigation,
}) => {
  if (isFocused) {
    let state = await loadState();
    if (state == null) {
      const autofill = await createAutofill();
      state = emptyState(autofill);
    }
    setState(state);
    setCallback(createNavCallback({navigation, state}));
  } else {
    setState(null);
    setCallback(null);
  }
};

export const TransectFormScreen = ({route, navigation}) => {
  const [state, setState] = useState(null);
  const [callback, setCallback] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    setup({
      setState,
      setCallback,
      createNavCallback: transectNavCallback,
      isFocused,
      navigation,
    });
  }, [isFocused, navigation]);

  const navigateToDashboard = useNavigateToDashboard();
  const doCancel = useCallback(async () => {
    await clearState();
    navigateToDashboard();
  }, [navigateToDashboard]);
  const onCancel = useCallback(
    () =>
      Alert.alert('Confirm leave', 'Discard the changes?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          onPress: doCancel,
        },
      ]),
    [doCancel],
  );
  return (
    <TransectForm
      initialValue={state && state.transect}
      callback={callback}
      state={state}
      onSave={dto => submit(dto, navigation)}
      onCancel={onCancel}
    />
  );
};
