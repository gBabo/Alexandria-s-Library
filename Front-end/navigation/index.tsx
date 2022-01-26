import * as React from 'react';
import { useEffect, useState } from 'react';
import { ColorSchemeName } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import Loading from '../components/UI/Loading';
import BrowseScreen from '../screens/BrowseScreen';
import DrawerNavigator from './DrawerNavigator';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { getAuthState } from '../store/slices/authentication';
import { registerForPushNotificationToken } from '../store/slices/user';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.authentication.isLoading);
  const localId = useAppSelector((s) => s.authentication.localId);
  const [showBrowse, setShowBrowse] = useState(true);

  useEffect(() => {
    dispatch(getAuthState());
  }, []);
  useEffect(() => {
    if (localId) dispatch(registerForPushNotificationToken());
  }, [localId]);

  return isLoading ? (
    <Loading />
  ) : (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {showBrowse && !localId && (
        <RootStack.Screen
          name="Browse"
          component={BrowseScreen}
          listeners={{ blur: () => setShowBrowse(false) }}
        />
      )}
      <RootStack.Screen name="Drawer" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
}
