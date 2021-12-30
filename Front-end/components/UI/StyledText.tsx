import * as React from 'react';
import { Text as DefaultText } from 'react-native';

import { Text } from './Themed';

export function RegularText(props: DefaultText['props']) {
  const { style } = props;
  return (
    <Text {...props} style={[{ fontFamily: 'OpenSans-Regular' }, style]} />
  );
}

export function SemiBoldText(props: DefaultText['props']) {
  const { style } = props;
  return (
    <Text {...props} style={[{ fontFamily: 'OpenSans-SemiBold' }, style]} />
  );
}
