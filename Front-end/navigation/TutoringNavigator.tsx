import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  TEnrolledStackParamList,
  TScheduledStackParamList,
  TStoreStackParamList,
} from './types';
import TStoreScreen from '../screens/Tutoring/TStoreScreen';
import TEnrolledScreen from '../screens/Tutoring/TEnrolledScreen';
import TScheduledScreen from '../screens/Tutoring/TScheduledScreen';

const TStoreStack = createNativeStackNavigator<TStoreStackParamList>();
const TEnrolledStack = createNativeStackNavigator<TEnrolledStackParamList>();
const TScheduledStack = createNativeStackNavigator<TScheduledStackParamList>();

export function TStoreNavigator() {
  return (
    <TStoreStack.Navigator screenOptions={{ headerShown: false }}>
      <TStoreStack.Screen name="Store" component={TStoreScreen} />
    </TStoreStack.Navigator>
  );
}

export function TEnrolledNavigator() {
  return (
    <TEnrolledStack.Navigator screenOptions={{ headerShown: false }}>
      <TEnrolledStack.Screen name="Enrolled" component={TEnrolledScreen} />
    </TEnrolledStack.Navigator>
  );
}

export function TScheduledNavigator() {
  return (
    <TScheduledStack.Navigator screenOptions={{ headerShown: false }}>
      <TScheduledStack.Screen name="Scheduled" component={TScheduledScreen} />
    </TScheduledStack.Navigator>
  );
}
