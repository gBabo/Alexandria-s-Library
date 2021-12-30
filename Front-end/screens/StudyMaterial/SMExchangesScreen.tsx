import * as React from 'react';
import { StyleSheet } from 'react-native';

import { SMExchangesStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function SMExchangesScreen({ navigation }: SMExchangesStackScreenProps<'Exchanges'>) {
  return (
    <View style={styles.container}>
      <RegularText>
        SMExchangesScreen
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
