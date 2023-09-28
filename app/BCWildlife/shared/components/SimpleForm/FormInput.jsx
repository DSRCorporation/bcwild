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

export const FormInput = ({ name, label, placeholder, multiline, numeric, suffix, textInputProps, editable, text, onChangeTextCustom }) => {
  const {styles, config, form, setForm, nameUpdater} = useSimpleFormContext();
  const labels = config.labels || {}; // name-defined labels if available
  const onChangeText = useMemo(() => nameUpdater(name), [nameUpdater, name]);
  let value = form[name];
  if ((typeof value).toString() !== 'string') {
    console.warn(`FormInput '${name}': invalid value type '${typeof value}'`);
    value = '';
  }
  const textInput = (
    <TextInput
      editable={editable}
      value={value}
      onChangeText={newText => {
        let text = newText;
        if (numeric) {
          text = newText.replaceAll(',', '.');
        }
        onChangeText(text);
        onChangeTextCustom && onChangeTextCustom(name, text, form, setForm);
      }}
      multiline={multiline}
      placeholder={placeholder}
      keyboardType={numeric ? Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric' : undefined}
      style={{...styles.textInput, opacity: editable ?? true ? 1 : 0.5}}
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

