import React, { ComponentType, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Colors from '../constants/Colors';

interface SortingOptionProps {
  label: string
  value: 'Ascending' | 'Descending' | 'Unselected'
  onValueChange: ((itemValue: any, itemPosition: number) => void)
}

export default function SortingOption({
  label,
  value,
  onValueChange,
}: SortingOptionProps) {
  const pickerRef = useRef<Picker<string>>(null);
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  return (
    <TouchableComponent onPress={(pickerRef.current as any)?.focus}>
      <View style={styles.container}>
        <Picker
          ref={pickerRef}
          selectedValue={value}
          onValueChange={onValueChange}
          mode="dropdown"
          dropdownIconColor={Colors.primary}
        >
          <Picker.Item
            label={label}
            value="Unselected"
            color={Colors.black}
            fontFamily="OpenSans-Regular"
          />
          <Picker.Item
            label={`${label}: Ascending ↑`}
            value="Ascending"
            color={Colors.primary}
            fontFamily="OpenSans-Regular"
          />
          <Picker.Item
            label={`${label}: Descending ↓`}
            value="Descending"
            color={Colors.primary}
            fontFamily="OpenSans-Regular"
          />
        </Picker>
      </View>
    </TouchableComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: -1,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
});
