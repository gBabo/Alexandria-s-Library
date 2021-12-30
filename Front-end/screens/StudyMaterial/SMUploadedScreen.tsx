import * as React from 'react';
import { StyleSheet } from 'react-native';

import { SMUploadedStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function SMUploadedScreen({ navigation }: SMUploadedStackScreenProps<'Uploaded'>) {
  return (
    <View style={styles.container}>
      <RegularText>
        SMUploadedScreen
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
