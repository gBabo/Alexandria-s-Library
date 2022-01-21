import React, { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import CustomButton from './UI/CustomButton';

interface NumberPickerProps {
  label: string,
  iconName: string
  min: number,
  max: number,
  valueState: [number, Dispatch<SetStateAction<number>>]
}

export default function NumberPicker({
  label,
  iconName,
  min,
  max,
  valueState,
}: NumberPickerProps) {
  const windowDimensions = useWindowDimensions();

  const [borderColor, setBorderColor] = useState(Colors.primary);

  return (
    <Card style={[styles.container, {
      borderColor,
      width: windowDimensions.width - 10,
    }]}
    >
      <SemiBoldText style={styles.label}>
        {label}
      </SemiBoldText>
      <View style={styles.valueContainer}>
        <SemiBoldText style={styles.value}>
          {valueState[0]}
        </SemiBoldText>
        <FontAwesome5 name={iconName} size={30} color={Colors.purple} />
      </View>
      <View style={styles.valueContainer}>
        <CustomButton
          onPress={() => {
            setBorderColor(Colors.success);
            valueState[1]((currentValue) => currentValue - 1);
          }}
          disabled={valueState[0] <= min}
          style={[styles.button, {
            borderTopLeftRadius: 100,
            borderBottomLeftRadius: 100,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: valueState[0] <= min ? Colors.secondary : Colors.blue,
          }]}
          small
        >
          <Ionicons name="remove" size={24} color={Colors.white} />
        </CustomButton>
        <CustomButton
          onPress={() => {
            setBorderColor(Colors.success);
            valueState[1]((currentValue) => currentValue + 1);
          }}
          disabled={valueState[0] >= max}
          style={[styles.button, {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 100,
            borderBottomRightRadius: 100,
            backgroundColor: valueState[0] >= max ? Colors.secondary : Colors.blue,
          }]}
          small
        >
          <Ionicons name="add" size={30} color={Colors.white} />
        </CustomButton>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 18,
    marginRight: 10,
  },
  button: {
    borderColor: Colors.transparent,
  },
});
