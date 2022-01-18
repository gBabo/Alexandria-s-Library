import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Colors from '../../constants/Colors';

export default function HorizontalDivider() {
  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.accent,
    height: 1,
    marginVertical: 5,
  },
});
