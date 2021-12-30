import React from 'react';
import { StyleSheet, View as DefaultView } from 'react-native';
import { View } from './Themed';

export default function Card({
  style,
  children,
  ...otherProps
}: DefaultView['props']) {
  return (
    <View {...otherProps} style={[styles.container, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});
