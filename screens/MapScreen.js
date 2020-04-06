import React, {useCallback, useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import * as Location from 'expo-location';

import Colors from '../constants/Colors';

const MapScreen = props => {
  const initialLocation = props.navigation.getParam('initialLocation');
  const readonly = props.navigation.getParam('readonly');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [mapUserButtonBugFix, setMapUserButtonBugFix] = useState(10);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : userLocation ? userLocation.lat : 28.6291429,
    longitude: initialLocation ? initialLocation.lng : userLocation ? userLocation.long : 77.2103226,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0021
  };

  const selectLocationHandler = event => {
    if (readonly) {
      return;
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      // could show an alert!
      return;
    }
    props.navigation.navigate('NewPlace', {pickedLocation: selectedLocation});
  }, [selectedLocation]);

  const res = async () => {
    const location = await Location.getCurrentPositionAsync({
      timeout: 5000,
      accuracy: Location.Accuracy.BestForNavigation
    });
    setUserLocation({
      lat: location.coords.latitude,
      long: location.coords.longitude
    })
  };

  useEffect(() => {
    props.navigation.setParams({saveLocation: savePickedLocationHandler});
  }, [savePickedLocationHandler]);

  useEffect(() => {
    res().then(() => console.log("Run"))

  }, []);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }
  //fixme Make a <<My Location>> Button - Problem with React Native Maps -> Randomly Shows Location Button
  return (
      <MapView
          style={{flex: 1, margin: mapUserButtonBugFix}}
          initialRegion={mapRegion}
          onPress={selectLocationHandler}
          showsUserLocation
          showsMyLocationButton={true}
          onUserLocationChange={(loc) => setUserLocation({
            lat: loc.nativeEvent.coordinate.latitude,
            long: loc.nativeEvent.coordinate.longitude
          })}
          onMapReady={() => setMapUserButtonBugFix(0)}
      >
        {markerCoordinates && (
            <Marker title="Picked Location" coordinate={markerCoordinates}/>
        )}
        {readonly && userLocation && <Polyline
            coordinates={[
              {latitude: userLocation.lat, longitude: userLocation.long},
              {latitude: markerCoordinates.latitude, longitude: markerCoordinates.longitude},
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000'
            ]}
            strokeWidth={6}
        />}
      </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  const saveFn = navData.navigation.getParam('saveLocation');
  const readonly = navData.navigation.getParam('readonly');
  return {
    headerRight: () => {
      if (readonly) return;
      return (
          <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
            <Text style={styles.headerButtonText}>Save</Text>
          </TouchableOpacity>
      )
    }
  }
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    margin: 10
  },
  headerButton: {
    marginHorizontal: 20
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : Colors.primary
  }
});

export default MapScreen;
