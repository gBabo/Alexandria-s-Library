import * as React from 'react';
import { useEffect } from 'react';

import { LogoutScreenProps } from '../../navigation/types';
import Loading from '../../components/UI/Loading';
import { logout } from '../../store/slices/authentication';
import useAppDispatch from '../../hooks/useAppDispatch';

export default function LogoutScreen({ navigation }: LogoutScreenProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      const { meta } = await dispatch(logout());
      if (meta.requestStatus === 'fulfilled') navigation.getParent()!.navigate('SM_Store');
    })();
  }, []);

  return (
    <Loading />
  );
}
