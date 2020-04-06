import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import MapPreview from '../components/MapPreview';
import Colors from '../constants/Colors';
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import HeaderButton from "../components/views/HeaderButton";
import {removePlace} from "../store/PlacesAction";

const PlaceDetailScreen = props => {
  const placeId = props.navigation.getParam('placeId');
  const selectedPlace = useSelector(state =>
      state.places.places.find(place => place.id === placeId)
  );
  const dispatch = useDispatch();

  const deletePLace = () => {
    dispatch(removePlace(selectedPlace.id, selectedPlace.imageUri));
    console.log('check deleted');
    props.navigation.navigate('Places')
  };

  let selectedLocation;

  if (selectedPlace) {
    selectedLocation = {lat: selectedPlace.lat, lng: selectedPlace.lng};
  }

  useEffect(() => {
    props.navigation.setParams({
      'deletefn': deletePLace
    })

  }, []);


  const showMapHandler = () => {
    props.navigation.navigate('Map', {
      readonly: true,
      initialLocation: selectedLocation
    });
  };

  return !selectedPlace ? <View/> : (
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <Image source={{uri: selectedPlace.imageUri}} style={styles.image}/>
        <View style={styles.locationContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>{selectedPlace.address}</Text>
          </View>
          <MapPreview
              style={styles.mapPreview}
              location={selectedLocation}
              onPress={showMapHandler}
          />
          <View style={styles.addressContainer}>
            {selectedPlace.note && <Text style={{...styles.address, ...{color: 'black'}}}>{selectedPlace.note}</Text>}
          </View>
        </View>
      </ScrollView>
  );
};

PlaceDetailScreen.navigationOptions = navData => {
  const deletefn = navData.navigation.getParam('deletefn');
  return {
    headerTitle: navData.navigation.getParam('placeTitle'),
    headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton} title={"title"}>
          <Item
              title="Add Place"
              iconName={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
              onPress={deletefn}
          />
        </HeaderButtons>
    )

  };
};

const styles = StyleSheet.create({
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
    backgroundColor: '#ccc'
  },
  locationContainer: {
    marginVertical: 20,
    width: '90%',
    maxWidth: 500,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10
  },
  addressContainer: {
    padding: 20
  },
  address: {
    color: Colors.primary,
    textAlign: 'center'
  },
  mapPreview: {
    width: '100%',
    maxWidth: 500,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }
});

export default PlaceDetailScreen;
