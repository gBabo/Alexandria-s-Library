import * as React from 'react';
import { StyleSheet } from 'react-native';

import { TScheduledStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function TScheduledScreen({ navigation }: TScheduledStackScreenProps<'Scheduled'>) {
  return (
    <View style={styles.container}>
      <RegularText>
        TScheduledScreen
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
