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

export interface SortingMethod<T> {
  value: keyof T
  order: 'Ascending' | 'Descending'
}

interface SearchBarProps<T> {
  searchPlaceholder: string
  searchState: [string, Dispatch<SetStateAction<string>>]
  sortingMethodState?: [SortingMethod<T>, Dispatch<SetStateAction<SortingMethod<T>>>]
  sortingOptions?: { label: string, value: keyof T }[]
}

export default function Topbar<T>({
  searchPlaceholder,
  searchState,
  sortingMethodState,
  sortingOptions,
}: SearchBarProps<T>) {
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  const sortingOptionsVisible = useState(false);
  const orderState = sortingOptions
    ? useState<('Ascending' | 'Descending' | 'Unselected')[]>(Array(sortingOptions.length)
      .fill('Unselected'))
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Searchbar placeholder={searchPlaceholder} valueState={searchState} />
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
      {sortingMethodState && sortingOptions && orderState && sortingOptionsVisible[0] && (
        <View style={styles.sortingOptions}>
          {sortingOptions.map(({
            label,
            value,
          }, index) => (
            <SortingOption
              key={index.toString()}
              label={label}
              value={orderState[0][index]}
              onValueChange={(itemValue) => {
                const newOrderState = Array(sortingOptions.length)
                  .fill('Unselected');
                newOrderState[index] = itemValue;
                orderState[1](newOrderState);
                if (itemValue !== 'Unselected') {
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
