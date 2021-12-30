import React, { ReactNode } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableHighlight } from 'react-native';

import Colors from '../../constants/Colors';
import Card from './Card';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void
  children: ReactNode
  backgroundColor?: string
}

export default function CustomButton({
  onPress,
  children,
  backgroundColor,
}: CustomButtonProps) {
  return (
    <TouchableHighlight activeOpacity={0.6} onPress={onPress}>
      <Card style={[styles.container, {
        backgroundColor: backgroundColor || Colors.tint,
        borderColor: Colors.primary,
      }]}
      >
        {children}
      </Card>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    padding: 10,
  },
});
