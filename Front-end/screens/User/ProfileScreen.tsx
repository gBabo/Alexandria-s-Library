import * as React from 'react';
import { StyleSheet } from 'react-native';

import { ProfileScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  return (
    <View style={styles.container}>
      <RegularText>
        ProfileScreen
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
