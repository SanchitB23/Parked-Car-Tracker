import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";


import Colors from '../../constants/Colors';

const PlaceItem = props => {
  let TouchableComponent = TouchableOpacity;
  useEffect(() => {
    TouchableComponent = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity
  }, []);

  return (
      <TouchableComponent onPress={props.onSelect} style={styles.placeItem}>
        <View style={{flexDirection: 'row'}}>
          <Image style={styles.image} source={{uri: props.image}}/>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.address}>{props.address}</Text>
          </View>
        </View>
        <TouchableComponent onPress={props.onDelete}>
          <MaterialCommunityIcons name='delete-forever' size={38} color="red" style={styles.icon}/>
        </TouchableComponent>
      </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  placeItem: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
    alignSelf: 'center'
  },
  infoContainer: {
    marginLeft: 25,
    width: 250,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5
  },
  address: {
    color: '#666',
    fontSize: 16
  },
});

export default PlaceItem;
