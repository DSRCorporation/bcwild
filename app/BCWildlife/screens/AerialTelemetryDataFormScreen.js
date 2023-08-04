import {BCWildLogo} from '../shared/components/BCWildLogo';
import {TitleText} from '../shared/components/TitleText';
import React from 'react';
import {InputLabel} from '../shared/components/InputLabel';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {DatePicker} from '../shared/components/DatePicker';
import {useImmer} from 'use-immer';
import {useAnimals} from './Animals/use-animals';
import {Picker} from '@react-native-picker/picker';
import {GalleryPicker} from '../shared/components/GalleryPicker';
import {BaseButton} from '../shared/components/BaseButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
  },
  inputContainer: {
    marginBottom: 8,
  },
});

const ArielTelemetryDataFormScreen = () => {
  const [form, setForm] = useImmer({
    date: new Date(),
    observer: '',
    animal: null,
    aspect: null,
    mesoSlope: null,
    macroPosition: null,
    photos: [],
    comments: '',
  });
  const {animals} = useAnimals();

  return (
    <ScrollView>
      <View style={styles.container}>
        <BCWildLogo />
        <TitleText>Aerial Telemetry data</TitleText>
        <View>
          <View>
            <View style={styles.inputContainer}>
              <InputLabel>Date</InputLabel>
              <DatePicker
                value={form.date}
                onChange={date =>
                  setForm(draft => {
                    draft.date = date;
                  })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Observer</InputLabel>
              <TextInput
                value={form.observer}
                onChangeText={value =>
                  setForm(draft => {
                    draft.observer = value;
                  })
                }
                placeholder="Enter observer"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Animal</InputLabel>
              <Picker
                selectedValue={form.animal}
                onValueChange={value =>
                  setForm(draft => {
                    draft.animal = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {animals.map(item => (
                  <Picker.Item key={item.id} label={item.name} value={item} />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Aspect</InputLabel>
              <Picker
                selectedValue={form.aspect}
                onValueChange={value =>
                  setForm(draft => {
                    draft.aspect = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                <Picker.Item label="N" value="N" />
                <Picker.Item label="NE" value="NE" />
                <Picker.Item label="E" value="E" />
                <Picker.Item label="SE" value="SE" />
                <Picker.Item label="S" value="S" />
                <Picker.Item label="SW" value="SW" />
                <Picker.Item label="W" value="W" />
                <Picker.Item label="NW" value="NW" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Meso slope</InputLabel>
              <Picker
                selectedValue={form.mesoSlope}
                onValueChange={value =>
                  setForm(draft => {
                    draft.mesoSlope = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                <Picker.Item label="Flat" value="Flat" />
                <Picker.Item label="Shallow" value="Shallow" />
                <Picker.Item label="Moderate" value="Moderate" />
                <Picker.Item label="Steep" value="Steep" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Macro position</InputLabel>
              <Picker
                selectedValue={form.macroPosition}
                onValueChange={value =>
                  setForm(draft => {
                    draft.macroPosition = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                <Picker.Item label="Apex" value="Apex" />
                <Picker.Item label="Face" value="Face" />
                <Picker.Item label="Upper" value="Upper" />
                <Picker.Item label="Middle" value="Middle" />
                <Picker.Item label="Lower" value="Lower" />
                <Picker.Item label="Valley Floor" value="Valley Floor" />
                <Picker.Item label="Flood plain" value="Flood plain" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <GalleryPicker
                onChange={photos =>
                  setForm(draft => {
                    draft.photos = photos;
                  })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>Comments</InputLabel>
              <TextInput
                value={form.comments}
                onChangeText={value =>
                  setForm(draft => {
                    draft.comments = value;
                  })
                }
                multiline={true}
                placeholder="Enter comments"
                style={styles.textInput}
              />
            </View>
          </View>
          <BaseButton
            style={styles.button}
            accessibilityLabel="create aerial telemetry data button"
            testID="createAerialTelemetryDataButton">
            <Text style={styles.buttonText}>Create</Text>
          </BaseButton>
        </View>
      </View>
    </ScrollView>
  );
};

export default ArielTelemetryDataFormScreen;
