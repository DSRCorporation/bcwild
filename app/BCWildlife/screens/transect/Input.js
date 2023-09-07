import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Text, View} from 'react-native';
import {DateTimePicker} from '../../shared/components/DateTimePicker';
import {InputLabel} from '../../shared/components/InputLabel';

const numericKeyboardNeeded = type => type === 'int' || type === 'float';

import {
  FormInput,
  useSimpleFormContext,
} from '../../shared/components/SimpleForm';

const InputText = ({inputConfig}) => {
  const {name, displayName, type, placeholder, editable, hint} = inputConfig;
  return (
    <FormInput
      name={name}
      label={displayName}
      numeric={numericKeyboardNeeded(type)}
      editable={editable}
      text={hint}
      placeholder={placeholder}
    />
  );
};

const InputChoice = ({inputConfig}) => {
  const {name, displayName, choices, hint} = inputConfig;
  const {styles, form, setForm} = useSimpleFormContext();
  return (
    <View style={styles.inputContainer}>
      <InputLabel>{displayName}</InputLabel>
      {hint && <Text>{hint}</Text>}
      <Picker
        selectedValue={form[name]}
        onValueChange={value =>
          setForm(draft => {
            draft[name] = value;
          })
        }>
        <Picker.Item label="Select" value={null} />
        {choices.map(item => (
          <Picker.Item key={item.id} label={item.value} value={item.id} />
        ))}
      </Picker>
    </View>
  );
};

const InputDate = ({inputConfig}) => {
  const {name, displayName, hint} = inputConfig;
  const {styles, form, setForm} = useSimpleFormContext();
  return (
    <View style={styles.inputContainer}>
      <InputLabel>{displayName}</InputLabel>
      {hint && <Text>{hint}</Text>}
      <DateTimePicker
        value={new Date(form[name])}
        mode="date"
        onChange={date =>
          setForm(draft => {
            draft[name] = date.getTime();
          })
        }
      />
    </View>
  );
};

const InputTypes = {
  text: InputText,
  choice: InputChoice,
  date: InputDate,
};

export const Input = ({inputConfig}) => {
  const {inputType, ifForm, ifState} = inputConfig;
  const {form, config} = useSimpleFormContext();
  const {state} = config;
  const I = InputTypes[inputType || 'text'];
  if (!I) {
    throw Error(`Unknown input type '${inputType}'`);
  }
  const formShowFlag = !ifForm || ifForm(form);
  const stateShowFlag = !ifState || ifState(state);
  const show = formShowFlag && stateShowFlag;
  return show ? <I inputConfig={inputConfig} /> : null;
};

export const Inputs = ({inputConfigs}) => (
  <>
    {inputConfigs.map(inputConfig => (
      <Input key={inputConfig.name} inputConfig={inputConfig} />
    ))}
  </>
);
