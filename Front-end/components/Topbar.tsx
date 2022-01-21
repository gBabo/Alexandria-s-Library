import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Modal, StyleSheet, TouchableWithoutFeedback, View,
} from 'react-native';

import Colors from '../constants/Colors';
import Searchbar from './Searchbar';
import SortingOption from './SortingOption';
import CustomButton from './UI/CustomButton';
import { SemiBoldText } from './UI/StyledText';

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
  const [barHeight, setBarHeight] = useState(0);

  return (
    <View>
      <View
        onLayout={(e) => setBarHeight(e.nativeEvent.layout.height)}
        style={styles.bar}
      >
        <Searchbar placeholder={searchPlaceholder} valueState={searchState} />
        {sortingOptions && (
        <View style={styles.sortingButton}>
          <CustomButton
            onPress={() => sortingOptionsVisible[1]((value) => !value)}
            style={{
              flex: 1,
              backgroundColor: sortingOptionsVisible[0] ? Colors.white : Colors.primary,
              borderColor: sortingOptionsVisible[0] ? Colors.primary : Colors.transparent,
            }}
          >
            <SemiBoldText style={[styles.text, {
              color: sortingOptionsVisible[0] ? Colors.primary : Colors.white,
            }]}
            >
              Order By
            </SemiBoldText>
          </CustomButton>
        </View>
        )}
      </View>
      {sortingOptions && sortingMethodState && orderState && (
        <Modal visible={sortingOptionsVisible[0]} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={() => sortingOptionsVisible[1](false)}>
            <View style={[styles.sortingOptions, { paddingTop: 62 + barHeight }]}>
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
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  sortingButton: {
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortingOptions: {
    flex: 1,
  },
});
