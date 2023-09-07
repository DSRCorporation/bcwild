import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';

import {EncounterForm} from './EncounterForm';
import {encounterNavCallback, loadState} from './navigation';

const setup = async ({
  setState,
  setCallback,
  createNavCallback,
  isFocused,
  navigation,
}) => {
  if (isFocused) {
    const state = await loadState();
    setState(state);
    setCallback(createNavCallback({navigation, state}));
  } else {
    setState(null);
    setCallback(null);
  }
};

export const EncounterFormScreen = ({route, navigation}) => {
  const [state, setState] = useState(null);
  const [callback, setCallback] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    setup({
      setState,
      setCallback,
      createNavCallback: encounterNavCallback,
      isFocused,
      navigation,
    });
  }, [isFocused, navigation]);

  // state is only needed for Scat ID.
  return (
    <EncounterForm
      initialValue={state && state.encounter}
      callback={callback}
      state={state}
    />
  );
};
