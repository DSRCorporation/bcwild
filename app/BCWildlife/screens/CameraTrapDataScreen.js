import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import { getUsernameG } from '../global';
import RecordsRepo from '../utility/RecordsRepo';
import {SimpleScreenHeader} from '../shared/components/SimpleScreenHeader';




const CameraTrapDataScreen = () => {
  const [projects, setProjects] = React.useState([]);
  const [isDeployView, setIsDeployView] = React.useState(true);


  const [selectedValueProject, setSelectedValueProject] = useState(null);
  const [deployCheck, setDeployCheck] = React.useState('');
  const [cameraAttached, setCameraAttached] = React.useState('');

  const [customCamera, setCustomCamera] = React.useState('');

  const [customHabitat, setCustomHabitat] = React.useState('');

  const [customTargetFeature, setCustomTargetFeature] = React.useState('');


  
  const [fieldcrew, setFieldcrew] = React.useState('');
  const [dateTime, setDateTime] = React.useState('');
  const [stationId, setStationId] = React.useState('');
  const [stationNorthing, setStationNorthing] = React.useState('');
  const [stationEasting, setStationEasting] = React.useState('');
  const [securityBox, setSecurityBox] = React.useState('');
  const [cameraHeight, setCameraHeight] = React.useState('');
  const [cameraDirection, setCameraDirection] = React.useState('');
  const [cameraId,setCameraId] = React.useState('');
  const [cameraMake, setCameraMake] = React.useState('');
  const [customCamValue,setCustomCamValue] = React.useState('');
  const [cameraModel, setCameraModel] = React.useState('');
  const [sdCardId,setSdCardId] = React.useState('');
  const [keyId, setKeyId] = React.useState('');
  const [visibility, setVisiblity] = React.useState('');
  const [habitatType, setHabitatType] = React.useState('');
  const [surveyId,setSurveyId] = React.useState('');
  const [customHabitatValue, setCustomHabitatValue] = React.useState('');
  const [targetFeature, setTargetFeature] = React.useState('');
  const [customTargetFeatureValue, setCustomTargetFeatureValue] = React.useState('');
  const [distanceFeature, setDistanceFeature] = React.useState('');
  const [quitePeriod, setQuitePeriod] = React.useState('0');
  const [triggerSensitivity, setTriggerSensitivity] = React.useState('');
  const [triggerTiming, setTriggerTiming] = React.useState('');
  const [photosTrigger, setPhotosTrigger] = React.useState('');
  const [baitLure, setBaitLure] = React.useState('Scent');
  const [isCamActive, setIsCamActive] = React.useState(false);
  const [isCamActiveArrival, setIsCamActiveArrival] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [cameraDamaged, setCameraDamaged] = React.useState('no');
  const [cameraDamagedReason, setCameraDamagedReason] = React.useState('');
  const [numOfPhotos, setNumOfPhotos] = React.useState('');
  const [batteryPercentage, setBatteryPercentage] = React.useState('');
  const [purposeVisit, setPurposeVisit] = React.useState('');
  const [cameraRemoved, setCameraRemoved] = React.useState('');
  const [cameraReplaced, setCameraReplaced] = React.useState();
  const [batteriesReplaced, setBatteriesReplaced] = React.useState('');
  const [sdCardReplaced, setSdCardReplaced] = React.useState('');


  const [locationPermission, setLocationPermission] = useState(null);


 
  

  useEffect(() => {
    handleLocalValues();
  }, []);

  const saveOffline =    () => {

    printAndAddData();

  }

  function printAndAddData() {
    const data = {};


    // optional values

    if (securityBox) {
      data.security_box = securityBox;
    }
    if (cameraHeight) {
      data.camera_height = cameraHeight;
    }

    if (sdCardId) {
      data.sd_card_id = sdCardId;
    }
    if (keyId) {
      data.key_id = keyId;
    }

    if (habitatType) {
      data.habitat_type = habitatType;
    }
    if (customHabitat) {
      data.habitat_type = customHabitatValue;
    }
  
    
  
    if (targetFeature) {
      data.target_feature = targetFeature;
    }
    if (customTargetFeature) {
      data.target_feature = customTargetFeatureValue;
    }
  
    if (distanceFeature) {
      data.distan_feature = distanceFeature;
    }
    if (quitePeriod) {
      data.quiet_period = quitePeriod;
    }
    if (triggerSensitivity) {
      data.trigger_sensitivity = triggerSensitivity;
    }
    if (triggerTiming) {
      data.trigger_timing = triggerTiming;
    }
    if (photosTrigger) {
      data.photos_trigger = photosTrigger;
    }

    if (numOfPhotos) {
      data.number_of_photos = numOfPhotos;
    }
    if (batteryPercentage) {
      data.battery_percent = batteryPercentage;
    }

    if (batteriesReplaced) {
      data.batteries_replaced = batteriesReplaced;
    }

    if (cameraAttached) {
     // data.camera_attached = cameraAttached;
    }

    if(selectedValueProject){
      data.project_id = selectedValueProject;
    }else{
      Alert.alert('Project is required');
      return;
    }

    if(surveyId){
      data.survey_id = surveyId;
    }else{
      Alert.alert('Survey ID is required');
      return;
    }

    if(fieldcrew){
      data.field_crew = fieldcrew;
    }else{
      Alert.alert('Field Crew is required');
      return;
    }


    if(dateTime){
      data.date_time = dateTime;
    }else{
      Alert.alert('Date and Time is required');
      return;
    }
    if(stationId){
      data.station_id = stationId;
    }else{
      Alert.alert('Station ID is required');
      return;
    }

    if(deployCheck){
        data.deploy_check = deployCheck;
    }else{
      Alert.alert('Deploy Check is required');
      return;
    }
    
    if(deployCheck == 'deploy'){
      if(stationNorthing){
        data.station_northing = stationNorthing;
      }else{
        Alert.alert('Station Northing is required');
        return;
      }
      if(stationEasting){
        data.station_easting = stationEasting;
      }else{
        Alert.alert('Station Easting is required');
        return;
      }
      if(cameraDirection){
        data.camera_compass_direction = cameraDirection;
      }else{
        Alert.alert('Camera Direction is required');
        return;
      }
      if(cameraId){
        data.camera_id = cameraId;
      }else{
        Alert.alert('Camera ID is required');
        return;
      }
      if(cameraMake){
        data.camera_make = cameraMake;
      }else{
        Alert.alert('Camera Make is required');
        return;
      }
      if (customCamera) {
        data.camera_make = customCamValue;
      }
      if(cameraModel){
        data.camera_model = cameraModel;
      }else{
        Alert.alert('Camera Model is required');
        return;
      }
      if(visibility){
        data.visibility = visibility;
      }else{
        Alert.alert('Visibility is required');
        return;
      }
      if(baitLure){
        data.bait_lure = baitLure;
      }else{
        Alert.alert('Bait/Lure is required');
        return;
      }
      if (isCamActive!=null){
        data.camera_active = isCamActive;
      }
      
      if(comments){
        data.comments = comments;
      }else{
        Alert.alert('Comments is required');
        return;
      }
      
    } else{

      if (isCamActiveArrival!=null  ){
        data.camera_active = isCamActiveArrival;
      }else
      {
        Alert.alert('Camera Active is required');
        return;
      }

      if (cameraDamaged){
        data.camera_damaged = cameraDamaged;
      }else{
        Alert.alert('Camera Damaged is required');
        return;
      }
      if(cameraDamaged == 'yes'){
        if (cameraDamagedReason){
          data.comments = data.comments+' - '+ cameraDamagedReason;
        }else{
          Alert.alert('Camera Damaged Reason is required');
          return;
        }
      }
      
      if (purposeVisit){
        data.purpose_visit = purposeVisit;
      }else{
        Alert.alert('Purpose of Visit is required');
        return;
      }
      if (cameraRemoved){
        data.camera_removed = cameraRemoved;
      }else{
        Alert.alert('Camera Removed is required');
        return;
      }
      if (cameraReplaced){
        data.camera_replaced = cameraReplaced;
      }else{
        Alert.alert('Camera Replaced is required');
        return;
      }
      if (sdCardReplaced){
        data.sd_card_replaced = sdCardReplaced;
      }else{
        Alert.alert('SD Card Replaced is required');
        return;
      }
    }

    var strvalue = JSON.stringify(data);
    console.log(strvalue);
    var timeNowEpoch = Math.round((new Date()).getTime() / 1000);

    console.log(timeNowEpoch);

    var username = getUsernameG();

    var recordIdentifier ='CAM_' + username + '_' + timeNowEpoch;

    RecordsRepo.addRecord(recordIdentifier, strvalue);
    Alert.alert('Record Saved');
    setDefaultValues();
  }

  const setDefaultValues = () => {
    setFieldcrew('');
    setDateTime('');
    setStationId('');
    setStationNorthing('');
    setStationEasting('');
    setSecurityBox('');
    setCameraHeight('');
    setCameraDirection('');
    setCameraId('');
    setCameraMake('');
    setCustomCamValue('');
    setCameraModel('');
    setSdCardId('');
    setKeyId('');
    setVisiblity('');
    setHabitatType('');
    setSurveyId('');
    setCustomHabitatValue('');
    setTargetFeature('');
    setCustomTargetFeatureValue('');
    setDistanceFeature('');
    setQuitePeriod('0');
    setTriggerSensitivity('');
    setTriggerTiming('0');
    setPhotosTrigger('1');
    setBaitLure('Scent');
    setIsCamActive(false);
    setIsCamActiveArrival('');
    setComments('');
    setCameraDamaged('no');
    setCameraDamagedReason('');
    setNumOfPhotos('');
    setBatteryPercentage('');
    setPurposeVisit('');
    setCameraRemoved('');
    setCameraReplaced(undefined);
    setBatteriesReplaced('');
    setSdCardReplaced('');
  };





  const handleValueChange = (value) => {
    console.log(value);
    setSelectedValueProject(value);
    projects.map(project => {
      if (project.project_id === value) {
        setSurveyId(project.project.survey_id);
      }
    });
  };

  const handleLocalValues = async() => {
    try{
      const projectsData = await EncryptedStorage.getItem('projects');
      console.log(projectsData);
      var proj = JSON.parse(projectsData);
      setProjects(proj);

          // datetime 
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.toLocaleString('default', { month: 'short' });
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();

      const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
      setDateTime(formattedDate);
    }catch(error){
      console.log(error);
    }

  }

  const handleImageUpload = () => {
    console.log('image upload');
  }

  const handleDeployCheck= (itemValue) => {
      console.log(itemValue);
      setDeployCheck(itemValue);
      if (itemValue === 'deploy') {
        setIsDeployView(true);
      }else{
        setIsDeployView(false);
      }
  }

  const handleHabitatType = (itemValue) => {
    console.log(itemValue);
    setHabitatType(itemValue);
    if (itemValue === 'Other') {
      setCustomHabitat(true);
    }else{
      setCustomHabitat(false);
    } 
  }

  const showCustomInputForHabitat = () => {
    if (customHabitat) {
      return (<View style={styles.inputContainer}>
        <Text style={styles.inputLabel}> Custom habitat type </Text>
        <TextInput
          style={styles.input}
          placeholder="Custom habitat type"
          keyboardType="default"
          value={customHabitatValue}
          onChangeText={(text) => setCustomHabitatValue(text)}
        />
      </View>);
    } else {
      return <></>;
    }
  };


  const handlecameraMake = (itemValue) => {
    console.log(itemValue);
    if (itemValue === 'Other') {
      setCameraMake(itemValue);
      setCustomCamera(true);
    }else{
      setCameraMake(itemValue);
      setCustomCamera(false);
    }
  }

  const handleCustomCameraMake = (text) => {
    console.log(text);
    setCustomCamValue(text);
    //setCameraMake(text);
  }

  const showCustomInputCameraMake = () => {
    if (customCamera) {
      return (<View style={styles.inputContainer}>
           <Text style={styles.inputLabel}> Custom camera make </Text>
              <TextInput
                style={styles.input}
                placeholder="Custom camera make"
                keyboardType="default"
                value={customCamValue}
                onChangeText={(text) => handleCustomCameraMake(text)}
              />
              </View>);
    } else {
      return <></>;
    }
  };

  const handleTargetFeature = (itemValue) => {
    console.log(itemValue);
    setTargetFeature(itemValue);
    if (itemValue === 'Other') {
      setCustomTargetFeature(true);
    }else{
      setCustomTargetFeature(false);
    }
  }

  const handleCustomTargetFeatureValue = (text) => {
    console.log(text);
    setCustomTargetFeatureValue(text);
  }

  const showCustomInputTargetFeature = () => {
    if (customTargetFeature) {
      return (<View style={styles.inputContainer}>
           <Text style={styles.inputLabel}> Custom Target Feature </Text>
              <TextInput
                style={styles.input}
                placeholder="Custom Target Feature"
                keyboardType="default"
                value={customTargetFeatureValue}
                onChangeText={(text) => handleCustomTargetFeatureValue(text)}
              />
              </View>);
    } else {
      return <></>;
    }
  };

  const handleSend = async() => {
    console.log('send');
    printAndAddData();
  }


  return (
    
    <View style={styles.container}>
      <ScrollView>
        <SimpleScreenHeader>Camera Trap Data</SimpleScreenHeader>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}> Project </Text>
              <View style={styles.dropdownContainer}>
              <Picker
                selectedValue={selectedValueProject}
                onValueChange={handleValueChange}
                  >
                    <Picker.Item label="Select a project" value={null} />
                    {projects.map(project => (
                      <Picker.Item
                        key={project.id}
                        label={project.project_id}
                        value={project.project_id}
                      />
                    ))}
              </Picker>
              </View>
              <Text style={styles.inputLabel}> Survey ID </Text>
              <TextInput
                style={styles.input}
                placeholder="Survey ID"
                keyboardType="default"
                value={surveyId}
                onChangeText={(text) => setSurveyId(text)}
              />
              <Text style={styles.inputLabel}> Field Crew </Text>
              <TextInput
                style={styles.input}
                placeholder="Field Crew"
                keyboardType="default"
                value={fieldcrew}
                onChangeText={(text) => setFieldcrew(text)}
              />
              <Text style={styles.inputLabel}> Date Time </Text>
              <TextInput
                style={styles.input}
                placeholder="Date Time"
                keyboardType="default"
                value={dateTime}
                onChangeText={(text) => setDateTime(text)}
              />

              <Text style={styles.inputLabel}> Station ID </Text>
              <TextInput
                style={styles.input}
                placeholder="Station ID"
                keyboardType="default"
                value={stationId}
                onChangeText={(text) => setStationId(text)}
              />
              <Text style={styles.inputLabel}> Deployment Check </Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={deployCheck}
                  onValueChange={(itemValue) => handleDeployCheck(itemValue)}
                >
                  <Picker.Item label="Select" value={null} />
                  <Picker.Item label="Deploy" value="deploy" />
                  <Picker.Item label="Check" value="check" />
                </Picker>
              </View>
              {isDeployView ? (
            <View style={styles.inputContainer} >

              <Text style={styles.inputLabel}> Station northing </Text>
              <TextInput
                style={styles.input}
                placeholder="Station northing"
                keyboardType="default"
                value={stationNorthing}
                onChangeText={(text) => setStationNorthing(text)}
              />
              <Text style={styles.inputLabel}> Station easting </Text>
              <TextInput
                style={styles.input}
                placeholder="Station easting"
                keyboardType="default"
                value={stationEasting}
                onChangeText={(text) => setStationEasting(text)}
              />
              <Text style={styles.inputLabel}> Camera Attached </Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={cameraAttached}
                    onValueChange={(itemValue) => setCameraAttached(itemValue)}
                  >
                    <Picker.Item label="Select" value={null} />
                    <Picker.Item label="Tree" value="tree" />
                    <Picker.Item label="Post" value="post" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
              </View>
              
              <Text style={styles.inputLabel}> Security Box </Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={securityBox}
                    onValueChange={(itemValue) => setSecurityBox(itemValue)}
                  >
                    <Picker.Item label="Select" value={null} />
                    <Picker.Item label="Yes" value="true" />
                    <Picker.Item label="No" value="false" />
                  </Picker>
              </View>


              <Text style={styles.inputLabel}> Camera Height ( in cm) </Text>
              <TextInput
                style={styles.input}
                placeholder="Camera Height in cms"
                keyboardType="numeric"
                value={cameraHeight}
                onChangeText={(text) => setCameraHeight(text)}
              />

              <Text style={styles.inputLabel}> Camera Compass Direction</Text>
              <TextInput
                style={styles.input}
                placeholder="Camera Compass Direction in degrees"
                keyboardType="default"
                value={cameraDirection}
                onChangeText={(text) => setCameraDirection(text)}
              />

              <Text style={styles.inputLabel}> Camera ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Camera ID"
                keyboardType="default"
                value={cameraId}
                onChangeText={(text) => setCameraId(text)}
              />

              <Text style={styles.inputLabel}> Camera Make </Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={cameraMake}
                    onValueChange={(itemValue) => handlecameraMake(itemValue)}
                  >
                    <Picker.Item label="Select" value={null} />
                    <Picker.Item label="Reconyx" value="Reconyx" />
                    <Picker.Item label="Bushnell" value="Bushnell" />
                    <Picker.Item label="Browning" value="Browning" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
              </View>
              {showCustomInputCameraMake()}

              <Text style={styles.inputLabel}> Camera Model </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Camera Model"
                value={cameraModel}
                onChangeText={(text) => setCameraModel(text)}
                
              />


              <Text style={styles.inputLabel}> SD Card ID  </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter SD Card ID"
                value={sdCardId}
                onChangeText={(text) => setSdCardId(text)}
              />


            <Text style={styles.inputLabel}>Key ID  </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Key ID"
                value={keyId}
                onChangeText={(text) => setKeyId(text)}
              />

            <Text style={styles.inputLabel}>Visiblity  </Text>
              <TextInput
                style={styles.input}
                placeholder="Visiblity n meters"
                value={visibility}
                keyboardType="numeric"
                onChangeText={(text) => setVisiblity(text)}
              />

              <Text style={styles.inputLabel}> Habitat Type </Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={habitatType}
                    onValueChange={(itemValue) => handleHabitatType(itemValue)}
                  >
                    <Picker.Item label="Select" value={null} />
                    <Picker.Item label="Forest" value="Forest" />
                    <Picker.Item label="Meadow" value="Meadow" />
                    <Picker.Item label="Bog" value="Bog" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
              </View>

              {showCustomInputForHabitat()}

              <Text style={styles.inputLabel}> Target Feature </Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={targetFeature}
                    onValueChange={(itemValue) => handleTargetFeature(itemValue)}
                  >
                    <Picker.Item label="Select" value={null} />
                    <Picker.Item label="Game Trail" value="Game Trail" />
                    <Picker.Item label="Human Trail" value="Human Trail" />
                    <Picker.Item label="Road" value="Road" />
                    <Picker.Item label="Feeding Area" value="Feeding Area" />
                    <Picker.Item label="Water hole" value="Water hole" />
                    <Picker.Item label="Rubbing Posts" value="Rubbing Posts" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
              </View>

              {showCustomInputTargetFeature()}

              <Text style={styles.inputLabel}> Distance Feature </Text>
              <TextInput
                style={styles.input}
                value={distanceFeature}
                placeholder="Distance feature in meters"
                onChangeText={(text) => setDistanceFeature(text)}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}> Quite Period </Text>
              <TextInput
                style={styles.input}
                value={quitePeriod}
                keyboardType="numeric"
                placeholder="Quiet Period"
                onChangeText={(text) => setQuitePeriod(text)}
              />


              <Text style={styles.inputLabel}> Trigger Sensitivity </Text>
              <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={triggerSensitivity}
                    onValueChange={(itemValue) => setTriggerSensitivity(itemValue)}
                  >
                    <Picker.Item label="Select" value={null} />
                    <Picker.Item label="Low" value="Low" />
                    <Picker.Item label="Medium" value="Medium" />
                    <Picker.Item label="High" value="High" />
                  </Picker>
              </View>

              <Text style={styles.inputLabel}> Trigger Timing </Text>
              <TextInput
                style={styles.input}
                value={triggerTiming}
                keyboardType="numeric"
                placeholder="Trigger Timing"
                onChangeText={(text) => setTriggerTiming(text)}
              />

              <Text style={styles.inputLabel}> Photos Trigger </Text>
              <TextInput
                style={styles.input}
                value={photosTrigger}
                keyboardType="numeric"
                placeholder="Trigger Timing"
                onChangeText={(text) => setPhotosTrigger(text)}
              />


              <Text style={styles.inputLabel}> Bait Lure </Text>
              <TextInput
                style={styles.input}
                value={baitLure}
                placeholder="Scent"
                onChangeText={(text) => setBaitLure(text)}
              />

              <Text style={styles.inputLabel}> Camera Active Leaving </Text>
              <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={isCamActive}
                    onValueChange={(itemValue) => setIsCamActive(itemValue)}
                  >
                    <Picker.Item label="Select" value={null} />
                    <Picker.Item label="Yes" value="yes" />
                    <Picker.Item label="No" value="no" />
                  </Picker>
              </View>

              <Text style={styles.inputLabel}> Comments </Text>
              <TextInput
                  multiline
                  numberOfLines={10}
                  style={styles.input}
                  onChangeText={text => setComments(text)}
                  value={comments}
                  placeholder="Comments"
                 />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleImageUpload();}}  
              >
                <Text style={styles.inputLabel}> Click to Add Photos </Text>   
              </TouchableOpacity>
              </View>) : (
                <View style={styles.inputContainer} >
                  <Text style={styles.inputLabel}> Camera Active Arriving </Text>
                  <View style={styles.dropdownContainer}>
                      <Picker
                        selectedValue={isCamActiveArrival}
                        onValueChange={(itemValue) => setIsCamActiveArrival(itemValue)}
                      >
                        <Picker.Item label="Select" value={null} />
                        <Picker.Item label="Yes" value="yes" />
                        <Picker.Item label="No" value="no" />
                      </Picker>
                  </View>

                  <Text style={styles.inputLabel}> Camera Damaged </Text>
                  <View style={styles.dropdownContainer}>
                      <Picker
                        selectedValue={cameraDamaged}
                        onValueChange={(itemValue) => 
                            setCameraDamaged(itemValue)
                        }
                      >
                        <Picker.Item label="Select" value={null} />
                        <Picker.Item label="Yes" value="yes" />
                        <Picker.Item label="No" value="no" />
                      </Picker>
                  </View>
                  {cameraDamaged == 'yes'? 
                  <View>
                  <Text style={styles.inputLabel}> Camera Damaged Reason </Text>  
                  <TextInput
                    style={styles.input}
                    value={cameraDamagedReason}
                    placeholder="Camera Damaged Reason"
                    onChangeText={(text) => setCameraDamagedReason(text)}
                  />
                  </View>
                  : null }
                 <Text style={styles.inputLabel}>Number of Photos </Text>
                  <TextInput
                    style={styles.input}
                    value={numOfPhotos}
                    placeholder="Number of Photos"
                    keyboardType="numeric"
                    onChangeText={(text) => setNumOfPhotos(text)}
                  />

                  <Text style={styles.inputLabel}> Battery Percentage </Text>
                  <TextInput
                    style={styles.input}
                    value={batteryPercentage}
                    placeholder="Battery Percentage"
                    keyboardType="numeric"
                    onChangeText={(text) => setBatteryPercentage(text)}
                  />


                  <Text style={styles.inputLabel}>Purpose Visit </Text>
                  <View style={styles.dropdownContainer}>
                      <Picker
                        selectedValue={purposeVisit}
                        onValueChange={(itemValue) => 
                            setPurposeVisit(itemValue)
                        }
                      >
                        <Picker.Item label="Select" value={null} />
                        <Picker.Item label="Camera Check" value="Camera Check" />
                        <Picker.Item label="Camera Retrival" value="Camera Retrival" />
                      </Picker>
                  </View>
                        {/*** edit from here  */}
                  <Text style={styles.inputLabel}>Camera Removed ?</Text>
                  <View style={styles.dropdownContainer}>
                      <Picker
                        selectedValue={cameraRemoved}
                        onValueChange={(itemValue) => 
                            setCameraRemoved(itemValue)
                        }
                      >
                        <Picker.Item label="Select" value={null} />
                        <Picker.Item label="Yes" value="Yes" />
                        <Picker.Item label="No" value="No" />
                      </Picker>
                  </View>

                  <Text style={styles.inputLabel}>Camera Replaced ? </Text>
                  <View style={styles.dropdownContainer}>
                      <Picker
                        selectedValue={cameraReplaced}
                        onValueChange={(itemValue) => 
                            setCameraReplaced(itemValue)
                        }
                      >
                        <Picker.Item label="Select" value={null} />
                        <Picker.Item label="Yes" value="Yes" />
                        <Picker.Item label="No" value="No" />
                      </Picker>
                  </View>

                  <Text style={styles.inputLabel}>Battery Replaced ? </Text>
                  <View style={styles.dropdownContainer}>
                      <Picker
                        selectedValue={batteriesReplaced}
                        onValueChange={(itemValue) => 
                            setBatteriesReplaced(itemValue)
                        }
                      >
                        <Picker.Item label="Select" value={null} />
                        <Picker.Item label="Yes" value="Yes" />
                        <Picker.Item label="No" value="No" />
                      </Picker>
                  </View>


                  <Text style={styles.inputLabel}>SD Card Replaced ? </Text>
                  <View style={styles.dropdownContainer}>
                      <Picker
                        selectedValue={sdCardReplaced}
                        onValueChange={(itemValue) => 
                            setSdCardReplaced(itemValue)
                        }
                      >
                        <Picker.Item label="Select" value={null} />
                        <Picker.Item label="Yes" value="Yes" />
                        <Picker.Item label="No" value="No" />
                      </Picker>
                  </View>

                  </View>)}

        <TouchableOpacity
            style={{ backgroundColor: '#234075', borderRadius: 10, 
            marginTop: 20, padding: 10,
            marginBottom: 20
            ,justifyContent:'center'}}
            onPress={saveOffline}
            accessibilityLabel="Save Button"
            testID="saveButton"
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18,textAlign:'center' }}>Save</Text>
        </TouchableOpacity>
                    
            </View>
          </ScrollView>
        </View>
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#EFEFEF',
    padding: 10,
    marginBottom: 10,
  },
});

export default CameraTrapDataScreen;
