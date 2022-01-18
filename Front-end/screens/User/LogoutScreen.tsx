import * as React from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { LogoutScreenProps } from '../../navigation/types';
import Loading from '../../components/UI/Loading';
import { logout } from '../../store/slices/authentication';
import useAppDispatch from '../../hooks/useAppDispatch';

export default function LogoutScreen({ navigation }: LogoutScreenProps) {
  const dispatch = useAppDispatch();

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Logout' });
  }, [navigation, isFocused]);

  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <Loading />
  );
}
