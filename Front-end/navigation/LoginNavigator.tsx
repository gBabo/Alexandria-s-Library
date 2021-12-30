import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginStackParamList } from './types';
import LoginScreen from '../screens/User/LoginScreen';
import RegisterScreen from '../screens/User/RegisterScreen';

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginNavigator() {
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }}>
      <LoginStack.Screen name="Login" component={LoginScreen} />
      <LoginStack.Screen name="Register" component={RegisterScreen} />
    </LoginStack.Navigator>
  );
}
