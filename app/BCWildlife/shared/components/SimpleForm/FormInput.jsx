import React, {useMemo} from 'react';
import { View, TextInput, Text, Platform } from "react-native";
import {InputLabel} from '../InputLabel';
import {useSimpleFormContext} from './SimpleFormContextProvider';

const WithSuffix = ({ children, suffix }) => {
  const style = {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  };
  return (
    <View style={style}>
      <View style={{flexGrow: 1}}>{children}</View><Text>{suffix}</Text>
    </View>
  );
}

export const FormInput = ({ name, label, placeholder, multiline, numeric, suffix, textInputProps, editable, text }) => {
  const {styles, config, form, nameUpdater} = useSimpleFormContext();
  const labels = config.labels || {}; // name-defined labels if available
  const onChangeText = useMemo(() => nameUpdater(name), [nameUpdater, name]);
  let value = form[name];
  if (typeof value !== 'string') {
    value = '';
    console.warn(`FormInput '${name}': invalid value type '${typeof value}'`);
  }
  const textInput = (
    <TextInput
      editable={editable}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      placeholder={placeholder}
      keyboardType={numeric ? Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric' : undefined}
      style={styles.textInput}
      {...textInputProps}
    />
  );
  const input = suffix ? <WithSuffix suffix={suffix}>{textInput}</WithSuffix> : textInput;
  return (
    <View style={styles.inputContainer}>
      <InputLabel>{label || labels[name]}</InputLabel>
      {text && <Text>{text}</Text>}
      {input}
    </View>
)};

