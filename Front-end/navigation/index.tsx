import * as React from 'react';
import { useEffect } from 'react';
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
  const isLoading = useAppSelector((s) => s.authentication.isLoading);
  const localId = useAppSelector((s) => s.authentication.localId);

  return isLoading ? (
    <Loading />
  ) : (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!localId && (
        <RootStack.Screen name="Browse" component={BrowseScreen} />
      )}
      <RootStack.Screen name="Drawer" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
}
