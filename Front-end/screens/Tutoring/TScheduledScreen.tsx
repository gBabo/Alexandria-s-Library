import * as React from 'react';
import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { TScheduledStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import CustomButton from '../../components/UI/CustomButton';

export default function TScheduledScreen({ navigation }: TScheduledStackScreenProps<'Scheduled'>) {
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Scheduled Sessions' });
  }, [navigation, isFocused]);

  return (
    <View style={styles.container}>
      <RegularText>
        TScheduledScreen
      </RegularText>
      <CustomButton
        onPress={() => navigation.navigate('Schedule')}
        style={styles.plusButton}
        small
      >
        <Ionicons name="add" size={40} color={Colors.white} />
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: 20,
    right: 20,
    borderRadius: 100,
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
  },
});
