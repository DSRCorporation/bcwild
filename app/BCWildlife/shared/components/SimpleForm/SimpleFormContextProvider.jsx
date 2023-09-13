import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from "react";
import {useImmer} from 'use-immer';
import {useFormScreenStyles} from '../../styles/use-form-screen-styles';

const SimpleFormContext = createContext();

export const useSimpleFormContext = () => useContext(SimpleFormContext);

export const SimpleFormContextProvider = ({initialForm, config, children}) => {
  const [form, setForm] = useImmer(initialForm);
  const [loading, setLoading] = useState(false)
  const styles = useFormScreenStyles();
  const nameUpdater = useCallback(name => value => setForm(draft => { draft[name] = value }), []);
  const configObj = useMemo(() => config || {}, [config]);
  const value = {
    form,
    setForm,
    loading,
    setLoading,
    styles,
    config: configObj,
    nameUpdater,
  };
  return (
    <SimpleFormContext.Provider value={value}>
      {children}
    </SimpleFormContext.Provider>
  );
}
