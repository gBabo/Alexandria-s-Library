import React, {
  ComponentType, Dispatch, SetStateAction, useState,
} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import Card from './UI/Card';
import Searchbar from './Searchbar';
import SortingOption from './SortingOption';

export interface SortingMethod {
  value: string
  order: 'Ascending' | 'Descending'
}

interface SearchBarProps {
  searchState: [string, Dispatch<SetStateAction<string>>]
  sortingMethodState?: [SortingMethod, Dispatch<SetStateAction<SortingMethod>>]
}

export default function Topbar({
  searchState,
  sortingMethodState,
}: SearchBarProps) {
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  const sortingOptionsVisible = useState(false);
  const sortingOptions = [
    {
      label: 'Likes',
      value: 'likes',
      orderState: useState('Unselected'),
    },
    {
      label: 'Author Rating',
      value: 'authorRating',
      orderState: useState('Unselected'),
    },
    {
      label: 'Publication Date',
      value: 'date',
      orderState: useState('Unselected'),
    },
    {
      label: 'Price',
      value: 'price',
      orderState: useState('Unselected'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Searchbar valueState={searchState} />
        {sortingMethodState
                && (
                <Card style={styles.button}>
                  <TouchableComponent
                    onPress={() => sortingOptionsVisible[1]((value) => !value)}
                  >
                    <View style={[styles.icon, {
                      backgroundColor: !sortingOptionsVisible[0] ? Colors.primary : Colors.white,
                      borderColor: !sortingOptionsVisible[0] ? Colors.white : Colors.primary,
                    }]}
                    >
                      <FontAwesome
                        name="sliders"
                        size={30}
                        color={!sortingOptionsVisible[0] ? Colors.white : Colors.primary}
                      />
                    </View>
                  </TouchableComponent>
                </Card>
                )}

      </View>
      {sortingMethodState && sortingOptionsVisible[0] && (
        <View style={styles.sortingOptions}>
          {sortingOptions.map(({
            label,
            value,
            orderState,
          }, index) => (
            <SortingOption
              key={index.toString()}
              label={label}
              valueState={orderState}
              onValueChange={(itemValue) => {
                if (itemValue !== 'Unselected') {
                  sortingOptions.forEach((sortingOption, i) => {
                    if (index !== i) sortingOption.orderState[1]('Unselected');
                  });
                  sortingOptionsVisible[1](false);
                  sortingMethodState[1]({
                    value,
                    order: itemValue,
                  });
                }
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortingOptions: {
    top: 66,
    right: 0,
    width: 333,
    position: 'absolute',
    zIndex: 1,
  },
  button: {
    marginTop: 5,
    marginRight: 5,
    width: 50,
    height: 50,
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
