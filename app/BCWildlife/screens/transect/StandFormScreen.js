import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {loadState, standNavCallback} from './navigation';
import {StandForm} from './StandForm';

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

export const StandFormScreen = ({route, navigation}) => {
  const [state, setState] = useState(null);
  const [callback, setCallback] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    setup({
      setState,
      setCallback,
      createNavCallback: standNavCallback,
      isFocused,
      navigation,
    });
  }, [isFocused, navigation]);

  return (
    <StandForm
      initialValue={state && state.stand}
      callback={callback}
      state={state}
    />
  );
};
