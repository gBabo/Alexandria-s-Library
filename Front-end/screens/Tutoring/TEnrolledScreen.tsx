import * as React from 'react';
import { StyleSheet } from 'react-native';

import { TEnrolledStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function TEnrolledScreen({ navigation }: TEnrolledStackScreenProps<'Enrolled'>) {
  return (
    <View style={styles.container}>
      <RegularText>
        TEnrolledScreen
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
