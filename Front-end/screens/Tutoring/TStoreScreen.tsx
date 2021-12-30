import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Item } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';
import { TStoreStackScreenProps } from '../../navigation/types';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function TStoreScreen({ navigation }: TStoreStackScreenProps<'Store'>) {
  const onPressHelp = useCallback(() => Alert.alert(
    'Help', `
    Here you can sign up for tutoring sessions.
    In doing so, the tutor will be notified and will have the option of accepting or withdrawing your enrollment.
    When accepted, the token transaction is performed.
    `, [{
      text: 'Got it!',
      style: 'default',
    }], {
      cancelable: true,
    },
  ), []);
  useLayoutEffect(() => navigation.getParent()!.setOptions({
    headerRight: () => (
      <MaterialIconsHeaderButtons>
        <Item
          title="help-outline"
          iconName="help-outline"
          color={Colors.accent}
          onPress={onPressHelp}
        />
      </MaterialIconsHeaderButtons>
    ),
  }), [navigation, onPressHelp]);

  return (
    <View style={styles.container}>
      <RegularText>
        TStoreScreen
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
