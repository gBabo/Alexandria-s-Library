import * as React from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

import { ProfileScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchUser } from '../../store/slices/user';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.user.isLoading);
  const user = useAppSelector((s) => s.user.user);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Profile' });
  }, [navigation, isFocused]);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return isLoading || !user ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
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
          <FontAwesome5
            name="ticket-alt"
            size={24}
            color={Colors.purple}
            style={styles.icon}
          />
        </View>
        <View style={[styles.block, styles.line]}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Rating</SemiBoldText>
            {`: ${user.rating}`}
          </RegularText>
          <AntDesign name="star" size={24} color={Colors.yellow} style={styles.icon} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
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
