import * as React from 'react';
import { useEffect } from 'react';
import { ColorSchemeName } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import DrawerNavigator from './DrawerNavigator';
import useAppDispatch from '../hooks/useAppDispatch';
import { getAuthState } from '../store/slices/authentication';

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
  useEffect(() => {
    dispatch(getAuthState());
  }, []);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Drawer" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
}
