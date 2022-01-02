import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import { getUser } from '../../store/slices/user';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.user.isLoading);
  const user = useAppSelector((s) => s.user.user);
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
