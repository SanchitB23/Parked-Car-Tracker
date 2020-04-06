import React, {useCallback, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useDispatch} from 'react-redux';
import * as placesActions from '../store/PlacesAction';
import ImagePicker from '../components/ImagePicker';
import LocationPicker from '../components/locationPicker';

const NewPlaceScreen = props => {
  const [titleValue, setTitleValue] = useState('');
  const [noteValue, setNoteValue] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const dispatch = useDispatch();

  const titleChangeHandler = text => {
    // you could add validation
    setTitleValue(text);
  };
  const noteChangeHandler = text => {
    // you could add validation
    setNoteValue(text);
  };

  const imageTakenHandler = imagePath => {
    setSelectedImage(imagePath);
  };

  const locationPickedHandler = useCallback(location => {
    setSelectedLocation(location);
  }, []);

  const savePlaceHandler = () => {
    dispatch(placesActions.addPlace(titleValue, selectedImage, selectedLocation, noteValue));
    props.navigation.goBack();
  };

  return (
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
              style={styles.textInput}
              onChangeText={titleChangeHandler}
              value={titleValue}
          />
          <ImagePicker onImageTaken={imageTakenHandler}/>
          <LocationPicker navigation={props.navigation} onLocationPicked={locationPickedHandler}/>
          <Text style={{...styles.label, ...{marginTop: 15}}}>Add a Note</Text>
          <TextInput
              style={styles.textInput}
              onChangeText={noteChangeHandler}
              value={noteValue}
          />
          <Button
              title="Save Place"
              color="green"
              onPress={savePlaceHandler}
          />
        </View>
      </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: 'Add Your Car Location'
};

const styles = StyleSheet.create({
  form: {
    margin: 30
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
});

export default NewPlaceScreen;
