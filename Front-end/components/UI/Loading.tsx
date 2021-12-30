import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import Colors from '../../constants/Colors';
import { View } from './Themed';

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
