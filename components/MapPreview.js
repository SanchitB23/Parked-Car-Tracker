import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

import ENV from '../env';

export default props => {
  let imagePreviewUrl;
  if (props.location) {
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${
        props.location.lat
    },${
        props.location.lng
    }&zoom=18&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${
        props.location.lat
    },${props.location.lng}&key=${ENV.googleMapsApiKey}`;
  }

  function onPressHandler() {

    props.onPress()
  }

  return (
      <TouchableOpacity onPress={onPressHandler} style={{...styles.mapPreview, ...props.style}}>
        {props.location ? (
            <Image style={styles.mapImage} source={{uri: imagePreviewUrl}}/>
        ) : (
            props.children
        )}
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapImage: {
    width: '100%',
    height: '100%'
  }
});
