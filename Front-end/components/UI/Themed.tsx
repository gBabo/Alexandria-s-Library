import * as React from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '../../constants/Colors';

export function Text({
  style,
  ...otherProps
}: DefaultText['props']) {
  const color = Colors.text;
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View({
  style,
  ...otherProps
}: DefaultView['props']) {
  const backgroundColor = Colors.background;
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
