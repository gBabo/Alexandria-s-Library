import React, { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import Searchbar from './Searchbar';
import SortingOption from './SortingOption';
import CustomButton from './UI/CustomButton';

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
  const sortingOptionsVisible = useState(false);
  const orderState = sortingOptions
    ? useState<('Ascending' | 'Descending' | 'Unselected')[]>(Array(sortingOptions.length)
      .fill('Unselected'))
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Searchbar placeholder={searchPlaceholder} valueState={searchState} />
        {sortingOptions && (
        <View style={styles.sortingButton}>
          <CustomButton
            onPress={() => sortingOptionsVisible[1]((value) => !value)}
            style={{
              backgroundColor: !sortingOptionsVisible[0] ? Colors.primary : Colors.white,
              borderColor: !sortingOptionsVisible[0] ? Colors.transparent : Colors.primary,
            }}
          >
            <FontAwesome
              name="sliders"
              size={30}
              color={!sortingOptionsVisible[0] ? Colors.white : Colors.primary}
            />
          </CustomButton>
        </View>
        )}
      </View>
      {sortingOptions && sortingMethodState && orderState && sortingOptionsVisible[0] && (
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
    justifyContent: 'center',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  sortingButton: {
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortingOptions: {
    top: 66,
    right: 0,
    width: 333,
    position: 'absolute',
    zIndex: 1,
  },
});
