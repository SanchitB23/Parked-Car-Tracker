import * as FileSystem from 'expo-file-system';

import {deletePlace, fetchPlaces, insertPlace} from '../Db';
import ENV from '../env';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

export const addPlace = (title, image, location, note) => {
  return async dispatch => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
            location.lat
        },${location.lng}&key=${ENV.googleMapsApiKey}`
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();

    if (!resData.results) {
      throw new Error('Something went wrong!');
    }

    const address = resData.results[0].formatted_address;

    const fileName = image.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath
      });

      const dbResult = await insertPlace(
          title,
          newPath,
          address,
          location.lat,
          location.lng,
          note
      );
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng
          },
          note
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      dispatch({type: SET_PLACES, places: dbResult.rows._array});
    } catch (err) {
      throw err;
    }
  };
};

export const removePlace = (id, imageUri) => async dispatch => {
  try {
    await FileSystem.deleteAsync(imageUri);
    console.log("File deleted")
  } catch (e) {
    console.error("Error with File System", e.message)
  }
  try {
    await deletePlace(id);
    dispatch(loadPlaces())
  } catch (e) {
    console.error(e)
  }
};
