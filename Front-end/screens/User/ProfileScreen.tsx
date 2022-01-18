import * as React from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';

import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import { getUser } from '../../store/slices/user';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { ProfileScreenProps } from '../../navigation/types';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.user.isLoading);
  const user = useAppSelector((s) => s.user.user);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Profile' });
  }, [navigation, isFocused]);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return isLoading || !user ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <RegularText>
        {user.email}
        {user.name}
        {user.credits}
        {user.rating}
        {user.institution}
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
