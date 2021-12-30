import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { RegularText } from './StyledText';

interface FallbackProps {
  message: string
}

export default function Fallback({
  message,
}: FallbackProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="database-remove"
        size={100}
        color={Colors.warning}
      />
      <RegularText style={[styles.fallback, { color: Colors.error }]}>
        {message}
      </RegularText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  fallback: {
    fontSize: 20,
    marginTop: 10,
  },
});
