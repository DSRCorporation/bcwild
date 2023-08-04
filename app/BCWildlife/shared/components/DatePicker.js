import {Platform, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import React, {useState} from 'react';

const styles = StyleSheet.create({
  textContainer: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
});

export const DatePicker = ({value, containerStyle, textStyle, onChange}) => {
  const [date, setDate] = useState(value);
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, newDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (newDate !== undefined) {
      setDate(newDate);
      onChange(newDate);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[styles.textContainer, containerStyle]}>
        <Text style={textStyle}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePickerModal
          mode="date"
          value={date}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};
