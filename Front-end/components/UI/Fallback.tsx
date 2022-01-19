import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { SemiBoldText } from './StyledText';
import { View } from './Themed';

interface FallbackProps {
  message: string
}

export default function Fallback({
  message,
}: FallbackProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="database-search"
        size={100}
        color={Colors.accent}
      />
      <SemiBoldText style={[styles.fallback, { color: Colors.primary }]}>
        {message}
      </SemiBoldText>
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
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    marginHorizontal: 20,
  },
});
