import * as React from 'react';
import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';

import { TStoreStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import useAppSelector from '../../hooks/useAppSelector';

export default function TutoringSessionScreen({
  navigation,
  route,
}: TStoreStackScreenProps<'TutoringSession'>) {
  const tutoringSessions = useAppSelector((s) => s.tutoring.tutoringSessions);
  const tutoringSession = tutoringSessions[route.params.id];

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: tutoringSession.name });
  }, [navigation, isFocused]);

  return (
    <View style={styles.container}>
      <RegularText>
        TutoringSessionScreen
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
