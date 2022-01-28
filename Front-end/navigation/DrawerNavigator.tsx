import * as React from 'react';
import {
  ComponentProps, Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import { View } from 'react-native';
import { NavigationProp, NavigationState, useNavigation } from '@react-navigation/core';
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/src/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { Subscription } from 'expo-clipboard';
import {
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
} from 'expo-notifications';

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
import { cardStyle } from '../components/UI/Card';

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
    inactiveBackgroundColor: Colors.primary,
  },
  SM_Store: {
    drawerLabel: 'Store',
    iconName: 'store',
    component: SMStoreNavigator,
    exposure: ScreenExposure.Always,
    inactiveBackgroundColor: Colors.primary,
  },
  SM_Exchanges: {
    drawerLabel: 'Exchange Proposals',
    iconName: 'exchange-alt',
    component: SMExchangesNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.primary,
  },
  SM_Acquired: {
    drawerLabel: 'Acquired',
    iconName: 'bookmark',
    component: SMAcquiredNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.primary,
  },
  SM_Uploaded: {
    drawerLabel: 'Uploaded',
    iconName: 'file-upload',
    component: SMUploadedNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.primary,
  },
  T_Store: {
    drawerLabel: 'Store',
    iconName: 'store',
    component: TStoreNavigator,
    exposure: ScreenExposure.Always,
    inactiveBackgroundColor: Colors.primary,
  },
  T_Enrolled: {
    drawerLabel: 'Enrolled',
    iconName: 'handshake',
    component: TEnrolledNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.primary,
  },
  T_Scheduled: {
    drawerLabel: 'Your Sessions',
    iconName: 'calendar-alt',
    component: TScheduledNavigator,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.primary,
  },
  A_Login: {
    drawerLabel: 'Login',
    iconName: 'sign-in-alt',
    component: LoginNavigator,
    exposure: ScreenExposure.RequiresGuest,
    inactiveBackgroundColor: Colors.blue,
  },
  A_Logout: {
    drawerLabel: 'Logout',
    iconName: 'sign-out-alt',
    component: LogoutScreen,
    exposure: ScreenExposure.RequiresAuthentication,
    inactiveBackgroundColor: Colors.blue,
  },
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const localId = useAppSelector((s) => s.authentication.localId);

  const drawerNavigation = useNavigation<NavigationProp<DrawerParamList>>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    responseListener.current = addNotificationResponseReceivedListener((response) => {
      const { code } = response.notification.request.content.data;
      switch (code) {
        case 'EXCHANGE':
          drawerNavigation.navigate('SM_Exchanges');
          break;
        case 'SETTLE_EXCHANGE':
          drawerNavigation.navigate('SM_Acquired');
          break;
        case 'ENROLL':
          drawerNavigation.navigate('T_Scheduled');
          break;
        case 'SETTLE_ENROLL':
          drawerNavigation.navigate('T_Enrolled');
          break;
        default:
          break;
      }
    });
    return () => {
      if (responseListener.current) removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
        <CustomExpandableDrawerItem
          name="SM"
          isExpandedState={isExpandedState.SM}
          focusedLabelState={focusedLabelState}
        />
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
        <CustomExpandableDrawerItem
          name="T"
          isExpandedState={isExpandedState.T}
          focusedLabelState={focusedLabelState}
        />
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
      style={[cardStyle, {
        borderColor: Colors.indigo,
        borderWidth: 0.5,
      }]}
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
  focusedLabelState,
}: {
  name: 'SM' | 'T',
  isExpandedState: [boolean, Dispatch<SetStateAction<boolean>>]
  focusedLabelState: [string, Dispatch<SetStateAction<string>>]
}) {
  const [isExpanded, setIsExpanded] = isExpandedState;
  const [focusedLabel] = focusedLabelState;

  const inactiveBackgroundColor = focusedLabel.startsWith(`${name}_`)
    ? Colors.accent
    : Colors.primary;

  return (
    <DrawerItem
      label={expandableLabel(expandables[name].drawerLabel, isExpanded)}
      icon={drawerIcon(expandables[name].iconName)}
      onPress={() => setIsExpanded((v) => !v)}
      activeBackgroundColor={Colors.indigo}
      activeTintColor={Colors.background}
      inactiveBackgroundColor={inactiveBackgroundColor}
      inactiveTintColor={Colors.background}
      labelStyle={{ fontFamily: 'OpenSans-SemiBold' }}
      style={[cardStyle, {
        borderColor: Colors.indigo,
        borderWidth: 0.5,
      }]}
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
