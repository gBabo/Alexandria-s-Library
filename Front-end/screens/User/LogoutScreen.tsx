import * as React from 'react';
import { useEffect } from 'react';

import Loading from '../../components/UI/Loading';
import { logout } from '../../store/slices/authentication';
import useAppDispatch from '../../hooks/useAppDispatch';

export default function LogoutScreen() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <Loading />
  );
}
