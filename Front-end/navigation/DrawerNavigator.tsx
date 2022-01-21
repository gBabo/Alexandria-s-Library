import * as React from 'react';
import {
  ComponentProps, Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import { View } from 'react-native';
import { NavigationState } from '@react-navigation/core';
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/src/types';
import { FontAwesome5 } from '@expo/vector-icons';

import { DrawerParamList } from './types';
import Colors from '../constants/Colors';
import useAppSelector from '../hooks/useAppSelector';
import { SemiBoldText } from '../components/UI/StyledText';
import HorizontalDivider from '../components/UI/HorizontalDivider';
import {
  SMAcquiredNavigator,
  SMExchangesNavigator,
  SMStoreNavigator,
  SMUploadedNavigator,
} from './StudyMaterialNavigator';
import {
  TEnrolledNavigator,
  TScheduledNavigator,
  TStoreNavigator,
} from './TutoringNavigator';
import ProfileScreen from '../screens/User/ProfileScreen';
import LogoutScreen from '../screens/User/LogoutScreen';
import LoginNavigator from './LoginNavigator';

const expandables = {
  SM: {
    drawerLabel: 'Study Materials',
    iconName: 'book',
  },
  T: {
    drawerLabel: 'Tutoring',
    iconName: 'chalkboard-teacher',
  },
};

enum ScreenExposure {
  Always,
  RequiresGuest,
  RequiresAuthentication,
}

const screens = {
  Profile: {
    drawerLabel: 'Profile',
    iconName: 'user-alt',
    component: ProfileScreen,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.secondary,
  },
  SM_Store: {
    drawerLabel: 'Store',
    iconName: 'store',
    component: SMStoreNavigator,
    exposure: ScreenExposure.Always,
    inactiveBackgroundColor: Colors.secondary,
  },
  SM_Exchanges: {
    drawerLabel: 'Exchanges',
    iconName: 'exchange-alt',
    component: SMExchangesNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.secondary,
  },
  SM_Acquired: {
    drawerLabel: 'Acquired',
    iconName: 'bookmark',
    component: SMAcquiredNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.secondary,
  },
  SM_Uploaded: {
    drawerLabel: 'Uploaded',
    iconName: 'file-upload',
    component: SMUploadedNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.secondary,
  },
  T_Store: {
    drawerLabel: 'Store',
    iconName: 'store',
    component: TStoreNavigator,
    exposure: ScreenExposure.Always,
    inactiveBackgroundColor: Colors.secondary,
  },
  T_Enrolled: {
    drawerLabel: 'Enrolled',
    iconName: 'handshake',
    component: TEnrolledNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.secondary,
  },
  T_Scheduled: {
    drawerLabel: 'Scheduled',
    iconName: 'calendar-alt',
    component: TScheduledNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.secondary,
  },
  A_Login: {
    drawerLabel: 'Login',
    iconName: 'sign-in-alt',
    component: LoginNavigator,
    exposure: ScreenExposure.RequiresGuest,
    inactiveBackgroundColor: Colors.info,
  },
  A_Logout: {
    drawerLabel: 'Logout',
    iconName: 'sign-out-alt',
    component: LogoutScreen,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.error,
  },
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const localId = useAppSelector((s) => s.authentication.localId);

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: Colors.primary },
        headerStyle: { backgroundColor: Colors.primary },
        headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
        headerTintColor: Colors.white,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {Object.entries(screens)
        .filter(([, screen]) => isDisplayable(localId, screen.exposure))
        .map(([name, screen]) => (
          <Drawer.Screen
            key={name}
            name={name as keyof DrawerParamList}
            component={screen.component}
            listeners={({ navigation }) => ({
              blur: ({ target }) => {
                const route = navigation.getState()
                  .routes
                  .find(({ key }: NavigationState<DrawerParamList>) => key === target);
                if (route && route.state) {
                  const {
                    type,
                    routes,
                  } = route.state;
                  if (type === 'stack' && routes.length > 1) navigation.popToTop();
                }
              },
            })}
          />
        ))}
    </Drawer.Navigator>
  );
}

const isDisplayable = (localId: string | null, exposure: ScreenExposure) => (
  exposure === ScreenExposure.RequiresAuthentication ? !!localId
    : exposure === ScreenExposure.RequiresGuest ? !localId
      : exposure === ScreenExposure.Always
);

function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
  const focusedLabelState = useState('');
  const isExpandedState = {
    SM: useState(false),
    T: useState(false),
  };

  const localId = useAppSelector((s) => s.authentication.localId);
  useEffect(() => {
    focusedLabelState[1](navigation.getState().routeNames[navigation.getState().index]);
  }, [localId]);

  return (
    <DrawerContentScrollView contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'space-between',
      marginVertical: 5,
    }}
    >
      <View>
        <View style={{
          alignItems: 'center',
          marginVertical: 20,
        }}
        >
          <SemiBoldText style={{
            fontSize: 24,
            color: Colors.white,
          }}
          >
            Alexandria's Library
          </SemiBoldText>
        </View>
        <CustomDrawerItem
          name="Profile"
          focusedLabelState={focusedLabelState}
          navigation={navigation}
        />
        <HorizontalDivider />
        <CustomExpandableDrawerItem name="SM" isExpandedState={isExpandedState.SM} />
        {isExpandedState.SM[0] && Object.keys(screens)
          .filter((name) => name.startsWith('SM_'))
          .map((name) => (
            <CustomDrawerItem
              key={name}
              name={name as keyof DrawerParamList}
              focusedLabelState={focusedLabelState}
              navigation={navigation}
            />
          ))}
        <HorizontalDivider />
        <CustomExpandableDrawerItem name="T" isExpandedState={isExpandedState.T} />
        {isExpandedState.T[0] && Object.keys(screens)
          .filter((name) => name.startsWith('T_'))
          .map((name) => (
            <CustomDrawerItem
              key={name}
              name={name as keyof DrawerParamList}
              focusedLabelState={focusedLabelState}
              navigation={navigation}
            />
          ))}
        <HorizontalDivider />
      </View>
      <View>
        <HorizontalDivider />
        {Object.keys(screens)
          .filter((name) => name.startsWith('A_'))
          .map((name) => (
            <CustomDrawerItem
              key={name}
              name={name as keyof DrawerParamList}
              focusedLabelState={focusedLabelState}
              navigation={navigation}
            />
          ))}
      </View>
    </DrawerContentScrollView>
  );
}

function CustomDrawerItem({
  name,
  focusedLabelState,
  navigation,
}: {
  name: keyof DrawerParamList,
  focusedLabelState: [string, Dispatch<SetStateAction<string>>]
  navigation: DrawerNavigationHelpers,
}) {
  if (!navigation.getState()
    .routeNames
    .includes(name)) {
    return null;
  }
  const [focusedLabel, setFocusedLabel] = focusedLabelState;

  return (
    <DrawerItem
      label={screens[name].drawerLabel}
      icon={drawerIcon(screens[name].iconName)}
      onPress={() => {
        navigation.navigate(name);
        setFocusedLabel(name);
      }}
      activeBackgroundColor={Colors.accent}
      activeTintColor={Colors.white}
      inactiveBackgroundColor={screens[name].inactiveBackgroundColor}
      inactiveTintColor={Colors.background}
      labelStyle={{ fontFamily: 'OpenSans-SemiBold' }}
      focused={name === focusedLabel}
    />
  );
}

const drawerIcon = (name: ComponentProps<typeof FontAwesome5>['name']) => (
  ({ color }: { color: string }) => (
    <FontAwesome5 name={name} color={color} size={24} />
  )
);

function CustomExpandableDrawerItem({
  name,
  isExpandedState,
}: {
  name: 'SM' | 'T',
  isExpandedState: [boolean, Dispatch<SetStateAction<boolean>>]
}) {
  const [isExpanded, setIsExpanded] = isExpandedState;

  return (
    <DrawerItem
      label={expandableLabel(expandables[name].drawerLabel, isExpanded)}
      icon={drawerIcon(expandables[name].iconName)}
      onPress={() => setIsExpanded((v) => !v)}
      activeBackgroundColor={Colors.info}
      activeTintColor={Colors.background}
      inactiveBackgroundColor={Colors.secondary}
      inactiveTintColor={Colors.background}
      labelStyle={{ fontFamily: 'OpenSans-SemiBold' }}
      focused={isExpanded}
    />
  );
}

const expandableLabel = (label: string, isExpanded: boolean) => (
  ({ color }: { color: string }) => (
    <View style={{
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    }}
    >
      <SemiBoldText style={{ color }}>{label}</SemiBoldText>
      <FontAwesome5
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        color={color}
        size={18}
      />
    </View>
  )
);
