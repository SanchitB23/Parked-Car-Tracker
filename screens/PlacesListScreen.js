import React, {useEffect} from 'react';
import {FlatList, Platform} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useDispatch, useSelector} from 'react-redux';

import HeaderButton from '../components/views/HeaderButton';
import PlaceItem from '../components/views/PlaceItem';
import {loadPlaces, removePlace} from "../store/PlacesAction";

const PlacesListScreen = props => {
  const places = useSelector(state => state.places.places);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPlaces())
  }, [dispatch]);

  return (
      <FlatList
          data={places}
          keyExtractor={item => item.id}
          renderItem={itemData => (
              <PlaceItem
                  image={itemData.item.imageUri}
                  title={itemData.item.title}
                  address={itemData.item.address}
                  onSelect={() => {
                    props.navigation.navigate('PlaceDetail', {
                      placeTitle: itemData.item.title,
                      placeId: itemData.item.id
                    });
                  }}
                  onDelete={() => {
                    dispatch(removePlace(itemData.item.id, itemData.item.imageUri))
                  }}
              />
          )}
      />
  );
};

PlacesListScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Car Tracker Home',
    headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton} title={"title"}>
          <Item
              title="Add Place"
              iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
              onPress={() => {
                navData.navigation.navigate('NewPlace');
              }}
          />
        </HeaderButtons>
    )
  };
};

export default PlacesListScreen;
