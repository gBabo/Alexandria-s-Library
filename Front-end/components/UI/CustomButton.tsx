import React, { ComponentType, ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  GestureResponderEvent,
  View,
  ViewProps,
} from 'react-native';

import Colors from '../../constants/Colors';
import Card from './Card';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void
  children: ReactNode
  style: ViewProps['style']
  row?: boolean
  small?: boolean
  disabled?: boolean
}

export default function CustomButton({
  onPress,
  children,
  style,
  row = false,
  small = false,
  disabled = false,
}: CustomButtonProps) {
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  return (
    <Card style={[styles.container, style]}>
      <TouchableComponent onPress={onPress} disabled={disabled}>
        <View style={[styles.button, {
          flexDirection: row ? 'row' : 'column',
          padding: small ? 10 : 15,
        }]}
        >
          {children}
        </View>
      </TouchableComponent>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.transparent,
    borderWidth: 1,
  },
  button: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 10,
  },
});
