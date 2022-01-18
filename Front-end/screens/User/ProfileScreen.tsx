import * as React from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
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
      <View style={styles.block}>
        <SemiBoldText style={styles.text}>{user.name}</SemiBoldText>
        <RegularText numberOfLines={1} style={styles.subtext}>{user.email}</RegularText>
      </View>
      <View style={styles.block}>
        <RegularText numberOfLines={1} style={styles.text}>
          <SemiBoldText>Institution</SemiBoldText>
          {`: ${user.institution}`}
        </RegularText>
      </View>
      <View style={[styles.block, styles.line]}>
        <RegularText numberOfLines={1} style={styles.text}>
          <SemiBoldText>Credits</SemiBoldText>
          {`: ${user.credits}`}
        </RegularText>
        <FontAwesome5 name="ticket-alt" size={24} color="#3949AB" style={styles.icon} />
      </View>
      <View style={[styles.block, styles.line]}>
        <RegularText numberOfLines={1} style={styles.text}>
          <SemiBoldText>Rating</SemiBoldText>
          {`: ${user.rating}`}
        </RegularText>
        <AntDesign name="star" size={24} color="#FBC02D" style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    marginVertical: 20,
  },
  line: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  icon: {
    marginHorizontal: 5,
  },
});
