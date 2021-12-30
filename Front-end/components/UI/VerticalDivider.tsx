import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Colors from '../../constants/Colors';

export default function VerticalDivider() {
  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    height: 1,
    marginVertical: 5,
  },
});
