import {BCWildLogo} from '../../shared/components/BCWildLogo';
import {TitleText} from '../../shared/components/TitleText';
import React, {useCallback} from 'react';
import {InputLabel} from '../../shared/components/InputLabel';
import {View, ScrollView, Text, TextInput} from 'react-native';
import {DatePicker} from '../../shared/components/DatePicker';
import {useImmer} from 'use-immer';
import {useAnimals} from '../Animals/use-animals';
import {Picker} from '@react-native-picker/picker';
import {GalleryPicker} from '../../shared/components/GalleryPicker';
import {BaseButton} from '../../shared/components/BaseButton';
import {useFormScreenStyles} from '../../shared/styles/use-form-screen-styles';
import {aerielTelemetryFormLabels} from '../../constants/aeriel-telemetry/aeriel-telemetry-labels';
import {
  aspectData,
  macroPositionData,
  mesoSlopeData,
} from '../../constants/aeriel-telemetry/aeriel-telemetry-data';
import {useBatSurveyFormValidation} from '../BatSurvey/use-bat-survey-form-validation';
import {useAerielTelemetryDataFormValidation} from './use-aeriel-telemetry-data-form-validation';

const ArielTelemetryDataFormScreen = () => {
  const styles = useFormScreenStyles();
  const [form, setForm] = useImmer({
    locationId: '',
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
  const {validate} = useAerielTelemetryDataFormValidation();

  const submit = useCallback(() => {
    const isValid = validate(form);
  }, [validate, form]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <BCWildLogo />
        <TitleText>Aerial Telemetry data</TitleText>
        <View>
          <View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.locationId}</InputLabel>
              <TextInput
                value={form.locationId}
                onChangeText={value =>
                  setForm(draft => {
                    draft.locationId = value;
                  })
                }
                placeholder="Enter location ID"
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.date}</InputLabel>
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
              <InputLabel>{aerielTelemetryFormLabels.observer}</InputLabel>
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
              <InputLabel>{aerielTelemetryFormLabels.animal}</InputLabel>
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
              <InputLabel>{aerielTelemetryFormLabels.aspect}</InputLabel>
              <Picker
                selectedValue={form.aspect}
                onValueChange={value =>
                  setForm(draft => {
                    draft.aspect = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {aspectData.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.value}
                    value={option.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.mesoSlope}</InputLabel>
              <Picker
                selectedValue={form.mesoSlope}
                onValueChange={value =>
                  setForm(draft => {
                    draft.mesoSlope = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {mesoSlopeData.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.value}
                    value={option.id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <InputLabel>{aerielTelemetryFormLabels.macroPosition}</InputLabel>
              <Picker
                selectedValue={form.macroPosition}
                onValueChange={value =>
                  setForm(draft => {
                    draft.macroPosition = value;
                  })
                }>
                <Picker.Item label="Select" value={null} />
                {macroPositionData.map(option => (
                  <Picker.Item
                    key={option.id}
                    label={option.value}
                    value={option.id}
                  />
                ))}
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
            onPress={submit}
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
