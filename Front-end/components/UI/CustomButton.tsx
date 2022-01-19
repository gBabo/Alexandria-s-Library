import React, { ComponentType, ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';

import Colors from '../../constants/Colors';
import { View } from './Themed';
import Card from './Card';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void
  children: ReactNode
  style: ViewStyle
}

export default function CustomButton({
  onPress,
  children,
  style,
}: CustomButtonProps) {
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  return (
    <Card style={styles.container}>
      <TouchableComponent onPress={onPress}>
        <View style={[styles.button, style]}>
          {children}
        </View>
      </TouchableComponent>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.transparent,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
