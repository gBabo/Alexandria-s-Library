import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Item } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';
import { SMStoreStackScreenProps } from '../../navigation/types';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';

export default function SMStoreScreen({ navigation }: SMStoreStackScreenProps<'Store'>) {
  const onPressHelp = useCallback(() => Alert.alert(
    'Help', `
    Here you can search, purchase and exchange study materials.
    It is possible to acquire materials using tokens or by trading materials already owned.
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
        SMStoreScreen
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
