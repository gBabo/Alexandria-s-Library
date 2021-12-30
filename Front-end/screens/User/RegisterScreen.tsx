import * as React from 'react';
import { StyleSheet } from 'react-native';

import { LoginStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function RegisterScreen({ navigation }: LoginStackScreenProps<'SignUp'>) {
  return (
    <View style={styles.container}>
      <RegularText>
        RegisterScreen
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
