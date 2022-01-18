import * as React from 'react';
import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';

import { SMAcquiredStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function SMAcquiredScreen({ navigation }: SMAcquiredStackScreenProps<'Acquired'>) {
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Acquired Materials' });
  }, [navigation, isFocused]);

  return (
    <View style={styles.container}>
      <RegularText>
        SMAcquiredScreen
      </RegularText>
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
