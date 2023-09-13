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

// Single input either for date or for time
const InputDateOrTime = ({inputConfig}) => {
  const {name, displayName, hint, textFormat, mode} = inputConfig;
  const {styles, form, setForm} = useSimpleFormContext();
  return (
    <View style={styles.inputContainer}>
      <InputLabel>{displayName}</InputLabel>
      {hint && <Text>{hint}</Text>}
      <DateTimePicker
        value={new Date(form[name])}
        mode={mode || 'date'}
        textFormat={textFormat}
        onChange={date =>
          setForm(draft => {
            draft[name] = date.getTime();
          })
        }
      />
    </View>
  );
};

// Two inputs, one for date, another for time
const InputDateTime = ({inputConfig}) => {
  const {
    name,
    displayNameDate,
    displayNameTime,
    hint,
    dateTextFormat,
    timeTextFormat,
  } = inputConfig;
  const {styles, form, setForm} = useSimpleFormContext();
  const value = new Date(form[name]);
  return (
    <View style={styles.inputContainer}>
      {hint && <Text>{hint}</Text>}
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
        }}>
        <View style={styles.inputContainer}>
          <InputLabel>{displayNameDate}</InputLabel>
          <DateTimePicker
            value={value}
            mode="date"
            onChange={date =>
              setForm(draft => {
                const newDate = new Date(value);
                newDate.setFullYear(date.getFullYear());
                newDate.setMonth(date.getMonth());
                newDate.setDate(date.getDate());
                newDate.setSeconds(0, 0);
                draft[name] = newDate.getTime();
              })
            }
            textFormat={dateTextFormat}
          />
        </View>
        <View style={styles.inputContainer}>
          <InputLabel>{displayNameTime}</InputLabel>
          <DateTimePicker
            value={value}
            mode="time"
            onChange={date =>
              setForm(draft => {
                const newDate = new Date(value);
                newDate.setHours(date.getHours());
                newDate.setMinutes(date.getMinutes());
                newDate.setSeconds(0, 0);
                draft[name] = newDate.getTime();
              })
            }
            textFormat={timeTextFormat}
          />
        </View>
      </View>
    </View>
  );
};

const InputTimestamp = ({inputConfig}) => {
  const mode = inputConfig.mode || 'date';
  const I = mode === 'datetime' ? InputDateTime : InputDateOrTime;
  return <I inputConfig={inputConfig} />;
};

const InputTypes = {
  text: InputText,
  choice: InputChoice,
  timestamp: InputTimestamp,
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
