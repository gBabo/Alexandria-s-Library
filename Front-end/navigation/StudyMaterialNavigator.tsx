import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  SMStoreStackParamList,
  SMExchangesStackParamList,
  SMAcquiredStackParamList,
  SMUploadedStackParamList,
} from './types';
import SMStoreScreen from '../screens/StudyMaterial/SMStoreScreen';
import SMExchangesScreen from '../screens/StudyMaterial/SMExchangesScreen';
import SMAcquiredScreen from '../screens/StudyMaterial/SMAcquiredScreen';
import SMUploadedScreen from '../screens/StudyMaterial/SMUploadedScreen';
import SMCategoryStoreScreen from '../screens/StudyMaterial/SMCategoryStoreScreen';
import StudyMaterialScreen from '../screens/StudyMaterial/StudyMaterialScreen';

const SMStoreStack = createNativeStackNavigator<SMStoreStackParamList>();
const SMExchangesStack = createNativeStackNavigator<SMExchangesStackParamList>();
const SMAcquiredStack = createNativeStackNavigator<SMAcquiredStackParamList>();
const SMUploadedStack = createNativeStackNavigator<SMUploadedStackParamList>();

export function SMStoreNavigator() {
  return (
    <SMStoreStack.Navigator screenOptions={{ headerShown: false }}>
      <SMStoreStack.Screen name="Store" component={SMStoreScreen} />
      <SMStoreStack.Screen name="CategoryStore" component={SMCategoryStoreScreen} />
      <SMStoreStack.Screen name="StudyMaterial" component={StudyMaterialScreen} />
    </SMStoreStack.Navigator>
  );
}

export function SMExchangesNavigator() {
  return (
    <SMExchangesStack.Navigator screenOptions={{ headerShown: false }}>
      <SMExchangesStack.Screen name="Exchanges" component={SMExchangesScreen} />
    </SMExchangesStack.Navigator>
  );
}

export function SMAcquiredNavigator() {
  return (
    <SMAcquiredStack.Navigator screenOptions={{ headerShown: false }}>
      <SMAcquiredStack.Screen name="Acquired" component={SMAcquiredScreen} />
      <SMAcquiredStack.Screen name="StudyMaterial" component={StudyMaterialScreen} />
    </SMAcquiredStack.Navigator>
  );
}

export function SMUploadedNavigator() {
  return (
    <SMUploadedStack.Navigator screenOptions={{ headerShown: false }}>
      <SMUploadedStack.Screen name="Uploaded" component={SMUploadedScreen} />
      <SMAcquiredStack.Screen name="StudyMaterial" component={StudyMaterialScreen} />
    </SMUploadedStack.Navigator>
  );
}
