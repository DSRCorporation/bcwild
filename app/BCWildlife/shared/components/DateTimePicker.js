import {Platform, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import React, {useCallback, useMemo, useState} from 'react';

const styles = StyleSheet.create({
  textContainer: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
});

export const DateTimePicker = ({
  value,
  mode = 'date',
  containerStyle,
  textFormat,
  textStyle,
  onChange,
}) => {
  const [date, setDate] = useState(value);
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = useCallback(
    (event, newDate) => {
      setShowPicker(Platform.OS === 'ios');
      if (newDate !== undefined) {
        setDate(newDate);
        onChange(newDate);
      }
    },
    [onChange],
  );

  const formattedValueText = useMemo(() => {
    if (textFormat != null) {
      return textFormat(value);
    }
    switch (mode) {
      case 'date':
        return value.toLocaleDateString();
      case 'time':
        return value.toLocaleTimeString();
      default:
        return value.toLocaleString();
    }
  }, [value, mode, textFormat]);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[styles.textContainer, containerStyle]}>
        <Text style={textStyle}>{formattedValueText}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePickerModal
          mode={mode}
          value={date}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};
